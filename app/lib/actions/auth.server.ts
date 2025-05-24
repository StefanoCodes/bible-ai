import { eq } from 'drizzle-orm';
import { data, redirect } from "react-router";
import { db } from "~/db/index.server";
import { usersTable } from "~/db/schema";
import { GetUserDetails } from '~/lib/data/user.server';
import { createSupabaseServerClient } from "~/server";
import { ProfileUpdateSchema, SignInSchema, signUpSchema } from "../zod/auth/auth";

export async function handleSignUp(request: Request, formData: FormData) {
    // form data to be validated first
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get("password");
    const role = formData.get("role");
    const signUpData = {
        name,
        email,
        password,
        role
    }
    const unvalidatedFields = signUpSchema.safeParse(signUpData)
    if (!unvalidatedFields.success) return data({
        success: false,
        message: 'Invalid Fields',
    }, {
        status: 403,
    })
    const validatedFields = unvalidatedFields.data;

    const { client, headers } = createSupabaseServerClient(request);
    const { data: supabaseResponse, error } = await client.auth.signUp({
        email: validatedFields.email,
        password: validatedFields.password,
    });



    if (error) {
        console.error(`Error Auth:`, error)
        return {
            success: false,
            message: error.message,
        };
    }
    const { user } = supabaseResponse;

    if (!user) {
        return data({
            success: false,
            message: 'Something went wrong'
        }, {
            status: 403,
        })
    }
    if (!user.id) {
        return data({
            success: false,
            message: 'Something went wrong'
        }, {
            status: 403,
        })
    }

    // insert into users table
    const insertedUser = await db.insert(usersTable).values({
        name: validatedFields.name,
        email: validatedFields.email,
        role: validatedFields.role,
        userId: supabaseResponse.user?.id ?? ""
    }).returning({ id: usersTable.id })

    if (!insertedUser) return data({
        success: false,
        message: 'Something went wrong'
    }, {
        status: 403,
    })
    return data({
        success: true,
        message: 'Account Successfully Created'
    }, {
        headers: headers
    })
}

export async function handleSignIn(request: Request, formData: FormData) {
    const loginData = {
        email: formData.get("email"),
        password: formData.get("password")
    };
    const unvalidatedFields = SignInSchema.safeParse(loginData)
    if (!unvalidatedFields.success) return data({
        success: false,
        message: 'Invalid Fields',
    }, {
        status: 403,
    })
    const validatedFields = unvalidatedFields.data;
    const { client, headers } = createSupabaseServerClient(request);

    const { data: LoginResponse, error } = await client.auth.signInWithPassword({
        email: validatedFields.email,
        password: validatedFields.password,
    });

    if (error) {
        return {
            success: false,
            message: error.message,
        };
    }

    const { user } = LoginResponse;

    if (!user)
        return {
            success: false,
            message: "User not found",
        };


    return data({
        success: true,
        message: 'User Logged In'
    }, {
        headers: headers
    })

}

export async function handleSignOut(request: Request) {
    const { client, headers } = createSupabaseServerClient(request);
    const { error } = await client.auth.signOut();
    if (error) {
        return {
            success: false,
            message: 'Something went wrong signing out, try again later'
        }
    }

    return {
        success: true,
        message: 'Logged out'
    }
}

export async function handleProfileUpdates(request: Request, formData: FormData) {
    const formDataObject = {
        name: formData.get("name") as string,
        email: formData.get("email") as string
    }
    const unvalidatedFields = ProfileUpdateSchema.safeParse(formDataObject);
    if (!unvalidatedFields.success) return data({
        success: false,
        message: "Invalid Fields"
    }, {
        status: 403,
    })
    const { name: newName, email: newEmail } = unvalidatedFields.data;

    // get user info from db and compare to see what needs to change
    const { user } = await GetUserDetails(request)
    if (!user?.userId) throw redirect('/sign-up');
    const { name, email, userId } = user;
    const isNameSame = name === newName;
    const isEmailSame = email === newEmail;
    const isNameNotSame = name !== newName;
    const isEmailNotSame = email !== newEmail;

    // update name only
    if (isNameNotSame && isEmailSame) {
        const { success } = await UpdateName(newName.toLowerCase(), userId);
        if (!success) {
            return data({ success: false, message: "Something went wrong updating user's name" })
        }
        return data({ success: true, message: "Name updated successfully" });
    }
    // if email changed only then update email in db + supabase action
    if (isEmailNotSame && isNameSame) {
        const { success } = await UpdateEmail(request, newEmail, userId)
        if (!success) {
            return data({
                success: false,
                message: `Something went wrong updating email's name`
            }, {
                status: 403,
            })
        }
        return {
            success: true,
            message: "Email has been updated, check your email for confirmation"
        }
    }
    // if both changed update both operations
    if (isEmailNotSame && isNameNotSame) {
        const [updateNameResult, updateEmailResult] = await Promise.all([
            UpdateName(name, userId),
            UpdateEmail(request, newEmail, userId)
        ])
        if (!updateNameResult.success || !updateEmailResult.success) {
            return {
                success: false,
            }
        }
        return {
            success: true,
            message: 'New email has been added check your email to confirm'
        }
    }
}
async function UpdateName(name: string, userId: string) {
    try {
        await db.update(usersTable).set({
            name,
        }).where(eq(usersTable.userId, userId))
        return {
            success: true
        }
    } catch (e) {
        console.error('🔴Error:Failed to update name of the user', e);
        return { success: false }
    }
}
async function UpdateEmail(request: Request, email: string, userId: string) {
    const { client } = createSupabaseServerClient(request);

    const { data, error } = await client.auth.updateUser({
        email,
    });
    if (error) {
        console.error(`Error updating email:`, error)
        return {
            success: false,
        }
    }
    try {
        await db.update(usersTable).set({
            email,
        }).where(eq(usersTable.userId, userId))
        return {
            success: true,
        }
    } catch (e) {
        console.error(`Error updating user email:`, e)
        return {
            success: false
        }
    }
}