import { z } from "zod"
import { PetInput as PetInputType, PetUpdateInput as PetUpdateInputType } from "@/lib/api/types/pet.types"

export const petSchema = z.object({
    petNumber: z.string().optional(),
    ownerId: z.number().int().positive("Owner ID must be a positive integer"),
    name: z.string().min(1, "Pet name is required").max(100),
    speciesId: z.number().int().positive("Species ID must be a positive integer"),
    breedId: z.number().int().positive().optional(),
    sexId: z.number().int().positive("Sex ID must be a positive integer"),
    primaryColorId: z.number().int().positive().optional(),
    secondaryColorId: z.number().int().positive().optional(),
    dateOfBirth: z.string().optional(),
    isBirthEstimated: z.boolean(),
    microchipNumber: z.string().max(50).optional(),
    microchipDate: z.string().optional(),
    microchipLocation: z.string().max(100).optional(),
    tattooNumber: z.string().max(50).optional(),
    isSterilized: z.boolean().optional(),
    sterilizationDate: z.string().optional(),
    sterilizationTypeId: z.number().int().positive().optional(),
    registrationNumber: z.string().max(100).optional(),
    isActive: z.boolean().optional(),
    dateOfDeath: z.string().optional(),
    causeOfDeath: z.string().max(500).optional(),
    specialNeeds: z.string().max(1000).optional(),
    behavioralNotes: z.string().max(1000).optional(),
    dietaryRestrictions: z.string().max(1000).optional(),
    exerciseRequirements: z.string().max(1000).optional(),
    acquisitionDate: z.string().optional(),
    acquisitionSource: z.string().max(200).optional(),
    previousOwnerInfo: z.string().max(500).optional(),
}) satisfies z.ZodType<PetInputType, z.ZodTypeDef, any>

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
