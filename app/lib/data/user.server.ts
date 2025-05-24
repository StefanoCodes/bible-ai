import { and, count, eq } from "drizzle-orm";
import { redirect } from "react-router";
import { db } from "~/db/index.server";
import { generationsTable, toolsTable, usersTable, type User } from "~/db/schema";
import { createSupabaseServerClient } from "~/server";

export async function GetUserDetails(request: Request) {
    // user in session
    const { client } = createSupabaseServerClient(request);
    const { data } = await client.auth.getUser();
    const { user } = data;

    if (!user) return { user: null }
    try {
        // user in db
        const [userDetails] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.userId, user.id)).limit(1);
        return {
            user: userDetails
        };
    } catch (e) {
        console.error(`🔴 Error Fetching Users Data`, e)
        return {
            user: null
        }
    }

}
export async function GetUserAnalytics(request: Request) {
    const { client } = createSupabaseServerClient(request);
    const { auth } = client;
    const { data: supabase } = await auth.getUser();
    if (!supabase.user?.id) throw redirect("/");
    try {
        // TODO: could improve by running in a transaction for better read speed but for now works
        const [storyTool] = await db.select().from(toolsTable).where(eq(toolsTable.intent, "simplify-bible-story")).limit(1);
        const [verseTool] = await db.select().from(toolsTable).where(eq(toolsTable.intent, "simplify-bible-verse")).limit(1);
        const [storiesGeneratedCount] = await db.select({ count: count() }).from(generationsTable).where(and(eq(generationsTable.userId, supabase.user.id), eq(generationsTable.toolId, storyTool.id)))
        const [versesGeneratedCount] = await db.select({ count: count() }).from(generationsTable).where(and(eq(generationsTable.userId, supabase.user.id), eq(generationsTable.toolId, verseTool.id)))



        return {
            storiesCount: storiesGeneratedCount,
            versesCount: versesGeneratedCount
        }

    } catch (e) {
        console.error(`Error fetching user analytics:`, e)
    }
}

