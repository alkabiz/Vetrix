import { z } from "zod"

export const loginSchema = z.object({
    login: z.string().min(1, "Username or email is required"),
    password: z.string().min(1, "Password is required"),
})

export const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["admin", "vet", "assistant"]),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

export async function validateLogin(request: Request): Promise<LoginInput> {
    const body = await request.json()
    return loginSchema.parse(body)
}

export async function validateRegister(request: Request): Promise<RegisterInput> {
    const body = await request.json()
    return registerSchema.parse(body)
}
