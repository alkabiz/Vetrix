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

// Extended schemas
export const petCreateSchema = petSchema
export const petUpdateSchema = petSchema.partial()
export const petMedicalInfoSchema = z.object({
  weight: z.number().positive("Weight must be positive").max(1000),
  age: z.number().int().min(0).max(50, "Age must be between 0 and 50"),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
})

// Type inference
export type PetInput = z.infer<typeof petSchema>
export type PetCreateInput = z.infer<typeof petCreateSchema>
export type PetUpdateInput = z.infer<typeof petUpdateSchema>