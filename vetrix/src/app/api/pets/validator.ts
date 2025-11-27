import { z } from "zod"

export const petSchema = z.object({
    owner_id: z.number().int().positive("Owner ID must be a positive integer"),
    name: z.string().min(1, "Pet name is required").max(100),
    species: z.string().min(1, "Species is required").max(50),
    breed: z.string().max(100).optional(),
    sex: z.enum(["male", "female", "unknown"]),
    age: z.number().int().min(0).max(50, "Age must be between 0 and 50"),
    weight: z.number().positive("Weight must be positive").max(1000),
    notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
})

export const petUpdateSchema = petSchema.partial()

export type PetInput = z.infer<typeof petSchema>
export type PetUpdateInput = z.infer<typeof petUpdateSchema>

export async function validatePet(request: Request): Promise<PetInput> {
    const body = await request.json()
    return petSchema.parse(body)
}

export async function validatePetUpdate(request: Request): Promise<PetUpdateInput> {
    const body = await request.json()
    return petUpdateSchema.parse(body)
}
