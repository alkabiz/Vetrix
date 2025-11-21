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

// Extended schemas
export const medicalRecordCreateSchema = medicalRecordSchema
export const medicalRecordUpdateSchema = medicalRecordSchema.partial()
export const medicalRecordVitalSignsSchema = z.object({
  temperature: z.number().min(35).max(42).optional(),
  weight: z.number().positive().max(1000).optional(),
  heart_rate: z.number().int().positive().max(300).optional(),
  respiratory_rate: z.number().int().positive().max(200).optional(),
})

// Type inference
export type MedicalRecordInput = z.infer<typeof medicalRecordSchema>
export type MedicalRecordCreateInput = z.infer<typeof medicalRecordCreateSchema>
export type MedicalRecordUpdateInput = z.infer<typeof medicalRecordUpdateSchema>
export type VitalSignsInput = z.infer<typeof medicalRecordVitalSignsSchema>