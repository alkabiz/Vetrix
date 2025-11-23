import type { PetFormData } from "../types/PetForm.types"
import type { Pet } from "@/lib/database/database"
import { deepEqual } from "./performance-utils"

/**
 * Transform form data to database format
 */
export function transformFormDataToPet(formData: PetFormData): Omit<Pet, "id" | "createdAt" | "updatedAt"> {
  // Convert empty strings to undefined for database
  const sanitizedData = sanitizeFormData(formData)

  return {
    petNumber: sanitizedData.petNumber,
    ownerId: Number(sanitizedData.ownerId),
    name: sanitizedData.name,
    speciesId: Number(sanitizedData.speciesId),
    breedId: sanitizedData.breedId ? Number(sanitizedData.breedId) : undefined,
    sexId: Number(sanitizedData.sexId),
    primaryColorId: sanitizedData.primaryColorId ? Number(sanitizedData.primaryColorId) : undefined,
    secondaryColorId: sanitizedData.secondaryColorId ? Number(sanitizedData.secondaryColorId) : undefined,
    dateOfBirth: sanitizedData.dateOfBirth ? new Date(sanitizedData.dateOfBirth) : undefined,
    isBirthEstimated: Boolean(sanitizedData.isBirthEstimated),
    microchipNumber: sanitizedData.microchipNumber || undefined,
    microchipDate: sanitizedData.microchipDate ? new Date(sanitizedData.microchipDate) : undefined,
    microchipLocation: sanitizedData.microchipLocation || undefined,
    tattooNumber: sanitizedData.tattooNumber || undefined,
    isSterilized: Boolean(sanitizedData.isSterilized),
    sterilizationDate: sanitizedData.sterilizationDate ? new Date(sanitizedData.sterilizationDate) : undefined,
    sterilizationTypeId: sanitizedData.sterilizationTypeId ? Number(sanitizedData.sterilizationTypeId) : undefined,
    registrationNumber: sanitizedData.registrationNumber || undefined,
    isActive: Boolean(sanitizedData.isActive),
    dateOfDeath: sanitizedData.dateOfDeath ? new Date(sanitizedData.dateOfDeath) : undefined,
    causeOfDeath: sanitizedData.causeOfDeath || undefined,
    specialNeeds: sanitizedData.specialNeeds || undefined,
    behavioralNotes: sanitizedData.behavioralNotes || undefined,
    dietaryRestrictions: sanitizedData.dietaryRestrictions || undefined,
    exerciseRequirements: sanitizedData.exerciseRequirements || undefined,
    acquisitionDate: sanitizedData.acquisitionDate ? new Date(sanitizedData.acquisitionDate) : undefined,
    acquisitionSource: sanitizedData.acquisitionSource || undefined,
    previousOwnerInfo: sanitizedData.previousOwnerInfo || undefined,
  }
}

/**
 * Transform database Pet object to form data format
 */
export function transformPetToFormData(pet: Pet): PetFormData {
  return {
    petNumber: pet.petNumber,
    ownerId: pet.ownerId,
    name: pet.name,
    speciesId: pet.speciesId,
    breedId: pet.breedId || "",
    sexId: pet.sexId,
    primaryColorId: pet.primaryColorId || "",
    secondaryColorId: pet.secondaryColorId || "",
    dateOfBirth: pet.dateOfBirth ? formatDateForInput(pet.dateOfBirth) : "",
    isBirthEstimated: pet.isBirthEstimated,
    microchipNumber: pet.microchipNumber || "",
    microchipDate: pet.microchipDate ? formatDateForInput(pet.microchipDate) : "",
    microchipLocation: pet.microchipLocation || "",
    tattooNumber: pet.tattooNumber || "",
    isSterilized: pet.isSterilized || false,
    sterilizationDate: pet.sterilizationDate ? formatDateForInput(pet.sterilizationDate) : "",
    sterilizationTypeId: pet.sterilizationTypeId || "",
    registrationNumber: pet.registrationNumber || "",
    isActive: pet.isActive,
    dateOfDeath: pet.dateOfDeath ? formatDateForInput(pet.dateOfDeath) : "",
    causeOfDeath: pet.causeOfDeath || "",
    specialNeeds: pet.specialNeeds || "",
    behavioralNotes: pet.behavioralNotes || "",
    dietaryRestrictions: pet.dietaryRestrictions || "",
    exerciseRequirements: pet.exerciseRequirements || "",
    acquisitionDate: pet.acquisitionDate ? formatDateForInput(pet.acquisitionDate) : "",
    acquisitionSource: pet.acquisitionSource || "",
    previousOwnerInfo: pet.previousOwnerInfo || "",
  }
}

/**
 * Clean up empty or null values from form data
 */
export function sanitizeFormData(formData: PetFormData): PetFormData {
  const sanitized = { ...formData }

  // Convert empty strings to undefined for optional fields
  const optionalStringFields: (keyof PetFormData)[] = [
    'microchipNumber', 'microchipLocation', 'tattooNumber', 'registrationNumber',
    'causeOfDeath', 'specialNeeds', 'behavioralNotes', 'dietaryRestrictions',
    'exerciseRequirements', 'acquisitionSource', 'previousOwnerInfo'
  ]

  optionalStringFields.forEach(field => {
    if (sanitized[field] === "") {
      // @ts-expect-error - We are intentionally setting this to undefined for cleanup, 
      // even though the type might expect a string. This is temporary before DB transformation.
      sanitized[field] = undefined
    }
  })

  // Convert empty strings to undefined for optional number fields
  const optionalNumberFields: (keyof PetFormData)[] = [
    'breedId', 'primaryColorId', 'secondaryColorId', 'sterilizationTypeId'
  ]

  optionalNumberFields.forEach(field => {
    if (sanitized[field] === "") {
      // @ts-expect-error - Same as above, temporary undefined for cleanup
      sanitized[field] = undefined
    }
  })

  // Convert empty strings to undefined for optional date fields
  const optionalDateFields: (keyof PetFormData)[] = [
    'dateOfBirth', 'microchipDate', 'sterilizationDate', 'dateOfDeath', 'acquisitionDate'
  ]

  optionalDateFields.forEach(field => {
    if (sanitized[field] === "") {
      // @ts-expect-error - Same as above, temporary undefined for cleanup
      sanitized[field] = undefined
    }
  })

  return sanitized
}

/**
 * Prepare form data for API submission
 */
export function prepareFormDataForSubmission(formData: PetFormData): Partial<Pet> {
  const sanitized = sanitizeFormData(formData)
  return transformFormDataToPet(sanitized)
}

/**
 * Merge partial updates with existing form data
 */
export function mergeFormDataUpdates(
  current: PetFormData,
  updates: Partial<PetFormData>
): PetFormData {
  return {
    ...current,
    ...updates,

    // Special handling for dependent fields
    ...(updates.speciesId && updates.speciesId !== current.speciesId && {
      breedId: "" // Reset breed when species changes
    }),

    ...(updates.isSterilized === false && {
      sterilizationDate: "",
      sterilizationTypeId: ""
    }),

    ...(updates.microchipNumber === "" && {
      microchipDate: ""
    }),

    ...(updates.dateOfDeath === "" && {
      causeOfDeath: ""
    })
  }
}

/**
 * Extract only changed fields from form data
 */
export function extractChangedFields(
  current: PetFormData,
  original: PetFormData
): Partial<PetFormData> {
  const changes: Partial<PetFormData> = {}

  Object.keys(current).forEach((k) => {
    const key = k as keyof PetFormData
    if (!deepEqual(current[key], original[key])) {
      // @ts-expect-error - TypeScript cannot correlate key type with value type in loop
      changes[key] = current[key]
    }
  })

  return changes
}

// Re-export date formatting utility
import { formatDateForInput } from "./date-utils"
export { formatDateForInput }