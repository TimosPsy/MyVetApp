import {z} from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, {error: "Username is required"}),
    password: z.string()
    .min(1, {message: "Password is required" })
    .min(8, {message: "Password must be at least 8 characters" })
    .regex(
        /(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?\W)^.{8,}$/,
        {message: "Password must contain at least one uppercase, one lowercase, one digit, and one special character"}
    ),
})

export type LoginFields = z.infer<typeof loginSchema>

export type LoginResponse = {
    access_token: string;
}