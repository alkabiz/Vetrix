import { z } from "zod"

export const createVeterinarianSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 characters"),
  specialization: z.string().min(3, "Specialization must be at least 3 characters"),
})

export const updateVeterinarianSchema = createVeterinarianSchema.partial()

export type CreateVeterinarianInput = z.infer<typeof createVeterinarianSchema>
export type UpdateVeterinarianInput = z.infer<typeof updateVeterinarianSchema>