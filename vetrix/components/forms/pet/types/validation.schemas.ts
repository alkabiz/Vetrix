import { z } from "zod"

// Common reusable schemas
export const idSchema = z.number().int().positive("ID must be a positive integer")
export const dateSchema = z.string().refine(
  (date) => !date || !isNaN(new Date(date).getTime()),
  "Must be a valid date"
).refine(
  (date) => !date || new Date(date) <= new Date(),
  "Date cannot be in the future"
)
export const optionalStringSchema = z.string().max(1000, "Cannot exceed 1000 characters").optional()
export const requiredStringSchema = z.string().min(1, "This field is required")

// Microchip validation (ISO 11784/11785 format)
export const microchipSchema = z.string().refine(
  (val) => !val || /^[0-9A-F]{15}$/i.test(val),
  "Microchip must be 15-digit hexadecimal (ISO 11784/11785)"
).optional()

// Basic Information Schema
export const petBasicInfoSchema = z.object({
  petNumber: z.string()
    .min(1, "Pet number is required")
    .regex(/^[A-Z0-9]+$/, "Pet number must be alphanumeric")
    .max(20, "Pet number cannot exceed 20 characters"),
  
  ownerId: idSchema,
  
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  
  speciesId: idSchema,
  breedId: idSchema.optional(),
  sexId: idSchema,
  
  primaryColorId: idSchema.optional(),
  secondaryColorId: idSchema.optional(),
})

// Birth & Age Schema
export const petBirthAndAgeSchema = z.object({
  dateOfBirth: dateSchema.optional().superRefine((date, ctx) => {
    if (!date && !ctx.data.isBirthEstimated) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either date of birth must be provided or birth must be marked as estimated",
        path: ["dateOfBirth"]
      });
    }
  }),
  isBirthEstimated: z.boolean(),
})

// Identification Schema
export const petIdentificationSchema = z.object({
  microchipNumber: microchipSchema,
  microchipDate: dateSchema.optional().superRefine((date, ctx) => {
    if (ctx.parent.microchipNumber && !date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Microchip date is required when microchip number is provided",
      });
    }
  }),
  microchipLocation: z.string().max(100, "Location cannot exceed 100 characters").optional(),
  tattooNumber: z.string().max(50, "Tattoo number cannot exceed 50 characters").optional(),
  registrationNumber: z.string().max(50, "Registration number cannot exceed 50 characters").optional(),
})

// Medical Information Schema
export const petMedicalInfoSchema = z.object({
  isSterilized: z.boolean(),
  sterilizationDate: z.string().optional(),
  sterilizationTypeId: idSchema.optional(),
  specialNeeds: optionalStringSchema,
  dietaryRestrictions: optionalStringSchema,
  dateOfDeath: dateSchema.optional(),
  causeOfDeath: z.string().max(500, "Cause of death cannot exceed 500 characters").optional(),
}).superRefine((data, ctx) => {
  if (data.isSterilized && (!data.sterilizationDate || !data.sterilizationTypeId)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Sterilization date and type are required when pet is sterilized",
      path: ["sterilizationDate"]
    });
  }
  if (data.dateOfDeath && !data.causeOfDeath) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Cause of death is required when date of death is provided",
      path: ["causeOfDeath"]
    });
  }
})

// Behavioral Schema
export const petBehaviorSchema = z.object({
  behavioralNotes: optionalStringSchema,
  exerciseRequirements: optionalStringSchema,
})

// Acquisition Schema
export const petAcquisitionSchema = z.object({
  acquisitionDate: dateSchema.optional(),
  acquisitionSource: z.string().max(100, "Source cannot exceed 100 characters").optional(),
  previousOwnerInfo: optionalStringSchema,
})

// Complete Form Schema
export const petFormSchema = petBasicInfoSchema
  .merge(petBirthAndAgeSchema)
  .merge(petIdentificationSchema)
  .merge(petMedicalInfoSchema)
  .merge(petBehaviorSchema)
  .merge(petAcquisitionSchema)
  .extend({
    isActive: z.boolean().default(true),
  })

// Partial schemas for updates
export const petCreateSchema = petFormSchema
export const petUpdateSchema = petFormSchema.partial()

// Validation functions
export const validatePetForm = (data: unknown) => {
  return petFormSchema.safeParse(data)
}

export const validatePetBasicInfo = (data: unknown) => {
  return petBasicInfoSchema.safeParse(data)
}

export const validatePetMedicalInfo = (data: unknown) => {
  return petMedicalInfoSchema.safeParse(data)
}