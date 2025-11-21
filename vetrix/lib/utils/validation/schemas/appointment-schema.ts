import { z } from "zod"

export const appointmentSchema = z.object({
  pet_id: z.number().int().positive("Pet ID must be a positive integer"),
  owner_id: z.number().int().positive("Owner ID must be a positive integer"),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  appointment_time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  assigned_vet: z.string().min(1, "Assigned vet is required").max(100),
  status: z.enum(["scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"]),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
})

// Extended schemas for different use cases
export const appointmentCreateSchema = appointmentSchema
export const appointmentUpdateSchema = appointmentSchema.partial()
export const appointmentStatusSchema = z.object({
  status: z.enum(["scheduled", "confirmed", "in_progress", "completed", "cancelled", "no_show"])
})

// Type inference
export type AppointmentInput = z.infer<typeof appointmentSchema>
export type AppointmentCreateInput = z.infer<typeof appointmentCreateSchema>
export type AppointmentUpdateInput = z.infer<typeof appointmentUpdateSchema>