import { z } from "zod"
import { 
  idParamSchema,
  appointmentSchema,
  petSchema,
  invoiceSchema,
  medicalRecordSchema
} from "./schemas"

// Generic validation functions
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

export function validateIdParam(id: string): { success: true; id: number } | { success: false; error: string } {
  const result = idParamSchema.safeParse({ id })
  if (!result.success) {
    return { success: false, error: "Invalid ID parameter" }
  }
  return { success: true, id: Number.parseInt(id, 10) }
}

export function validateFormData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const path = err.path.join(".")
        errors[path] = err.message
      })
      return { success: false, errors }
    }
    return { success: false, errors: { _form: "Validation failed" } }
  }
}

// Entity-specific validation functions
export const validateAppointment = (data: unknown) => validateFormData(appointmentSchema, data)
export const validatePet = (data: unknown) => validateFormData(petSchema, data)
export const validateInvoice = (data: unknown) => validateFormData(invoiceSchema, data)
export const validateMedicalRecord = (data: unknown) => validateFormData(medicalRecordSchema, data)