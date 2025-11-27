import { z } from "zod"

export const medicalRecordSchema = z.object({
    pet_id: z.number().int().positive("Pet ID must be a positive integer"),
    appointment_id: z.number().int().positive().optional(),
    visit_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    reason_for_visit: z.string().min(1, "Reason for visit is required").max(500),
    diagnosis: z.string().max(1000, "Diagnosis cannot exceed 1000 characters").optional(),
    treatment: z.string().max(1000, "Treatment cannot exceed 1000 characters").optional(),
    notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
})

export type MedicalRecordInput = z.infer<typeof medicalRecordSchema>

export async function validateMedicalRecord(request: Request): Promise<MedicalRecordInput> {
    const body = await request.json()
    return medicalRecordSchema.parse(body)
}
