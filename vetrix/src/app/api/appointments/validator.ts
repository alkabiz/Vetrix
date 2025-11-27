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

export type AppointmentInput = z.infer<typeof appointmentSchema>

export async function validateAppointment(request: Request): Promise<AppointmentInput> {
    const body = await request.json()
    return appointmentSchema.parse(body)
}
