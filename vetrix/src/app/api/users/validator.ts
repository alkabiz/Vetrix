import { z } from "zod"

export const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").optional(), // Optional for updates
    roleId: z.number().int().positive(),
    statusId: z.number().int().positive(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
})

export type UserInput = z.infer<typeof userSchema>

export async function validateUser(request: Request): Promise<UserInput> {
    const body = await request.json()
    return userSchema.parse(body)
}
