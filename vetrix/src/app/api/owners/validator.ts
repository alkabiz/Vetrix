import { z } from "zod"

export const ownerSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    phone: z.string().min(1, "Phone is required").max(20),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    address: z.string().max(200).optional(),
})

export type OwnerInput = z.infer<typeof ownerSchema>

export async function validateOwner(request: Request): Promise<OwnerInput> {
    const body = await request.json()
    return ownerSchema.parse(body)
}
