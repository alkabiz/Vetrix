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

export const invoiceSchema = z.object({
  owner_id: z.number().int().positive("Owner ID must be a positive integer"),
  pet_id: z.number().int().positive("Pet ID must be a positive integer"),
  appointment_id: z.number().int().positive().optional(),
  invoice_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  services: z.string().min(1, "Services description is required").max(1000),
  total_amount: z.number().positive("Total amount must be positive").max(999999.99),
  status: z.enum(["pending", "paid", "overdue", "cancelled"]),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
})

export const medicalRecordSchema = z.object({
  pet_id: z.number().int().positive("Pet ID must be a positive integer"),
  appointment_id: z.number().int().positive().optional(),
  visit_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  reason_for_visit: z.string().min(1, "Reason for visit is required").max(500),
  diagnosis: z.string().max(1000, "Diagnosis cannot exceed 1000 characters").optional(),
  treatment: z.string().max(1000, "Treatment cannot exceed 1000 characters").optional(),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
})

export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (request: Request): Promise<{ success: true; data: T } | { success: false; error: string }> => {
    try {
      const body = await request.json()
      const validatedData = schema.parse(body)
      return { success: true, data: validatedData }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ")
        return { success: false, error: `Validation failed: ${errorMessages}` }
      }
      return { success: false, error: "Invalid request data" }
    }
  }
}

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a valid number"),
})

export function validateIdParam(id: string): { success: true; id: number } | { success: false; error: string } {
  const result = idParamSchema.safeParse({ id })
  if (!result.success) {
    return { success: false, error: "Invalid ID parameter" }
  }
  return { success: true, id: Number.parseInt(id, 10) }
}
