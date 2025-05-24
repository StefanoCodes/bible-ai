import { data, redirect } from "react-router";
import { db } from "~/db/index.server";
import { generationsTable, usersTable } from "~/db/schema";
import { createSupabaseServerClient } from "~/server";
import { generateSimplifiedBibleStory, generateSimplifiedBibleVerse } from "../ai/generations";
import { storyRequestSchema } from "../zod/generations/simplify-bible-story";
import { refundUserToken, updateUserTokens } from "./user.server";
import { verseRequestSchema } from "../zod/generations/simplify-bible-verse";
import { deleteGenerationRequestSchema } from "../zod/generations/delete-generation";
import { and, eq } from "drizzle-orm";

export async function handleSimplifyBibleStory(request: Request, formData: FormData) {
    // auth check
    const { client, headers } = createSupabaseServerClient(request);
    const { auth } = client;
    const { data: supabase } = await auth.getUser();
    if (!supabase.user?.id) throw redirect("/");
    // check for the tool id
    const toolId = formData.get("toolId") as string;
    if (!toolId) throw redirect("/dashboard/tools")
    // form data
    const title = formData.get('title') as string;
    const originalReferences = formData.get('originalReferences') as string;
    const ageGroup = formData.get("ageGroup") as string;
    const toolSlug = formData.get("toolSlug") as string;
    const formDataObject = {
        title,
        originalReferences,
        ageGroup,
    }
    const unvalidatedFields = storyRequestSchema.safeParse(formDataObject)
    if (!unvalidatedFields.success) return data({
        success: false,
        message: 'Invalid Fields',
        errors: unvalidatedFields.error,
    }, {
        status: 403,
    })
    const validatedFields = unvalidatedFields.data;

    // ai generation (in future pass the original references)
    const updatedUserTokenResponse = await updateUserTokens(supabase.user.id)
    // if something went wrong updateing the user token
    if (!updatedUserTokenResponse.success) {
        console.error(`🔴Error from deducting token`);
        return {
            success: updatedUserTokenResponse.success,
            message: updatedUserTokenResponse.message
        }
    }

    const generationRes = await generateSimplifiedBibleStory(validatedFields.title, validatedFields.ageGroup)
    // incase something went wrong with the generationResponse we refund the token
    if (!generationRes || !generationRes?.success || !generationRes.object) {
        const { success } = await refundUserToken(supabase.user.id);
        if (!success) {
            console.error(`🔴Error from refunding token`);
            return data({
                success: false,
                message: "Something went wrong refunding your token"
            }, {
                status: 403,
            })
        }
        return data({
            success: false,
            // message: "Generation Failed, your token has been refunded"
            message: 'Generation Failed, try again',
            data: null
        }, {

            status: 403,
        })
    }
    // generation nothing went wrong at this point
    const generationResponse = generationRes.object;

    // save generation in db
    const [insertedGeneration] = await db.insert(generationsTable).values({
        toolId,
        userId: supabase.user?.id,
        data: JSON.stringify(generationResponse),

    }).returning({ id: generationsTable.id })
    if (!insertedGeneration) return data({
        success: false,
        message: 'Something went wrong'
    }, {
        status: 403,
    })
    const generationId = insertedGeneration.id;

    return redirect(`/dashboard/generations/${toolSlug}/${generationId}`, {
        headers
    });
}
export async function handleSimplifyBibleVerse(request: Request, formData: FormData) {
    // auth check
    const { client, headers } = createSupabaseServerClient(request);
    const { auth } = client;
    const { data: supabase } = await auth.getUser();
    if (!supabase.user?.id) throw redirect("/");
    // check for the tool id
    const toolId = formData.get("toolId") as string;
    if (!toolId) throw redirect("/dashboard/tools")
    // form data
    const feeling = formData.get('feeling') as string;
    const bibleVerseReference = formData.get('bibleVerseReference') as string;
    const toolSlug = formData.get("toolSlug") as string;
    const formDataObject = {
        feeling,
        bibleVerseReference,
    }
    const unvalidatedFields = verseRequestSchema.safeParse(formDataObject)
    if (!unvalidatedFields.success) return data({
        success: false,
        message: 'Invalid Fields',
        errors: unvalidatedFields.error,
    }, {
        status: 403,
    })
    const validatedFields = unvalidatedFields.data;

    // ai generation (in future pass the original references)
    const updatedUserTokenResponse = await updateUserTokens(supabase.user.id)
    // if something went wrong updateing the user token
    if (!updatedUserTokenResponse.success) {
        console.error(`🔴Error from deducting token`);
        return {
            success: updatedUserTokenResponse.success,
            message: updatedUserTokenResponse.message
        }
    }

    const generationRes = await generateSimplifiedBibleVerse(validatedFields.feeling, validatedFields.bibleVerseReference)
    // incase something went wrong with the generationResponse we refund the token
    if (!generationRes || !generationRes?.success || !generationRes.object) {
        const { success } = await refundUserToken(supabase.user.id);
        if (!success) {
            console.error(`🔴Error from refunding token`);
            return data({
                success: false,
                message: "Something went wrong refunding your token"
            }, {
                status: 403,
            })
        }
        return data({
            success: false,
            message: "Generation Failed, your token has been refunded"
        }, {

            status: 403,
        })
    }
    // generation nothing went wrong at this point
    const generationResponse = generationRes.object;

    // save generation in db
    const [insertedGeneration] = await db.insert(generationsTable).values({
        toolId,
        userId: supabase.user?.id,
        data: JSON.stringify(generationResponse),

    }).returning({ id: generationsTable.id })
    if (!insertedGeneration) return data({
        success: false,
        message: 'Something went wrong'
    }, {
        status: 403,
    })
    const generationId = insertedGeneration.id;
    return redirect(`/dashboard/generations/${toolSlug}/${generationId}`, {
        headers
    });
}
export async function handleDeleteGeneration(request: Request, formData: FormData) {
    // auth check
    const { client, headers } = createSupabaseServerClient(request);
    const { auth } = client;
    const { data: supabase } = await auth.getUser();
    if (!supabase.user?.id) throw redirect("/", { status: 403 });
    const generationId = formData.get("generationId") as string;
    if (!generationId) throw redirect("/dashboard/tools", {
        status: 403
    })

    const formDataObject = {
        generationId,

    }
    const unvalidatedFields = deleteGenerationRequestSchema.safeParse(formDataObject)
    if (!unvalidatedFields.success) return data({
        success: false,
        message: 'Invalid Fields',
        errors: unvalidatedFields.error,
    }, {
        status: 403,
    })
    const validatedFields = unvalidatedFields.data;

    try {
        await db.delete(generationsTable).where(and(eq(generationsTable.id, validatedFields.generationId), eq(generationsTable.userId, supabase.user.id)))

    } catch (e) {
        console.error(`Error Deleting Generation`, e)
        return data({
            success: false,
            message: "Deleting Generation Failed"
        }, {
            headers,
            status: 500,
            statusText: "Internal Server Error"
        })
    }

    return data({
        success: true,
        message: "Generation Deleted"
    }, {
        headers
    });
}