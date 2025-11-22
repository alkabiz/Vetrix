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
export const petBirthAndAgeBaseSchema = z.object({
  dateOfBirth: dateSchema.optional(),
  isBirthEstimated: z.boolean(),
})

const birthAndAgeRefinement = (data: z.infer<typeof petBirthAndAgeBaseSchema>, ctx: z.RefinementCtx) => {
  if (!data.dateOfBirth && !data.isBirthEstimated) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Either date of birth must be provided or birth must be marked as estimated",
      path: ["dateOfBirth"]
    });
  }
}

export const petBirthAndAgeSchema = petBirthAndAgeBaseSchema.superRefine(birthAndAgeRefinement)

// Identification Schema
export const petIdentificationBaseSchema = z.object({
  microchipNumber: microchipSchema,
  microchipDate: dateSchema.optional(),
  microchipLocation: z.string().max(100, "Location cannot exceed 100 characters").optional(),
  tattooNumber: z.string().max(50, "Tattoo number cannot exceed 50 characters").optional(),
  registrationNumber: z.string().max(50, "Registration number cannot exceed 50 characters").optional(),
})

const identificationRefinement = (data: z.infer<typeof petIdentificationBaseSchema>, ctx: z.RefinementCtx) => {
  if (data.microchipNumber && !data.microchipDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Microchip date is required when microchip number is provided",
      path: ["microchipDate"]
    });
  }
}

export const petIdentificationSchema = petIdentificationBaseSchema.superRefine(identificationRefinement)

// Medical Information Schema
export const petMedicalInfoBaseSchema = z.object({
  isSterilized: z.boolean(),
  sterilizationDate: z.string().optional(),
  sterilizationTypeId: idSchema.optional(),
  specialNeeds: optionalStringSchema,
  dietaryRestrictions: optionalStringSchema,
  dateOfDeath: dateSchema.optional(),
  causeOfDeath: z.string().max(500, "Cause of death cannot exceed 500 characters").optional(),
})

const medicalInfoRefinement = (data: z.infer<typeof petMedicalInfoBaseSchema>, ctx: z.RefinementCtx) => {
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
}

export const petMedicalInfoSchema = petMedicalInfoBaseSchema.superRefine(medicalInfoRefinement)

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
const petFormBaseSchema = petBasicInfoSchema
  .merge(petBirthAndAgeBaseSchema)
  .merge(petIdentificationBaseSchema)
  .merge(petMedicalInfoBaseSchema)
  .merge(petBehaviorSchema)
  .merge(petAcquisitionSchema)
  .extend({
    isActive: z.boolean().default(true),
  })

export const petFormSchema = petFormBaseSchema
  .superRefine(birthAndAgeRefinement)
  .superRefine(identificationRefinement)
  .superRefine(medicalInfoRefinement)

// Partial schemas for updates
export const petCreateSchema = petFormSchema
export const petUpdateSchema = petFormBaseSchema.partial()

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