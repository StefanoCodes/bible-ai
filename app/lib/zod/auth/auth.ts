import { z } from "zod";

export const role = z.enum(["student", "teacher", "adult"], {
    message: 'Role is required'
})

// Auth
export const signUpSchema = z.object({
    name: z.string({ message: 'Name is required' }).min(2, 'Name must be at least 2 characters').trim().transform((value) => {
        return value.toLocaleLowerCase();
    }),

    email: z.string({ message: "Email is required" }).email({
        message: "Invalid email address"
    }).trim(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
            message:
                "Password must contain at least one letter, one number, and one special character",
        }),
    role: role,

})

export const SignInSchema = z.object({
    email: z.string({ message: "Email is required" }).email({
        message: "Invalid email address",
    }),
    password: z.string({ message: "Password is required" }).min(8, {
        message: "Password must be at least 8 characters",
    }),
});

export const ProfileUpdateSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email().min(1, { message: "Email is required" })
})

export type SignupRequest = z.infer<typeof signUpSchema>
export type SignInRequest = z.infer<typeof SignInSchema>
export type ProfileUpdateRequest = z.infer<typeof ProfileUpdateSchema>