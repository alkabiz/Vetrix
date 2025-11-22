import type { PetFormData } from "../types/PetForm.types"
import type { Pet } from "@/lib/database/database"

/**
 * Transform form data to database format
 */
export function transformFormDataToPet(formData: PetFormData): Omit<Pet, "id" | "createdAt" | "updatedAt"> {
  // Convert empty strings to undefined for database
  const sanitizedData = sanitizeFormData(formData)

  return {
    petNumber: sanitizedData.petNumber,
    ownerId: sanitizedData.ownerId as number,
    name: sanitizedData.name,
    speciesId: sanitizedData.speciesId as number,
    breedId: sanitizedData.breedId as number | undefined,
    sexId: sanitizedData.sexId as number,
    primaryColorId: sanitizedData.primaryColorId as number | undefined,
    secondaryColorId: sanitizedData.secondaryColorId as number | undefined,
    dateOfBirth: sanitizedData.dateOfBirth ? new Date(sanitizedData.dateOfBirth) : undefined,
    isBirthEstimated: sanitizedData.isBirthEstimated,
    microchipNumber: sanitizedData.microchipNumber || undefined,
    microchipDate: sanitizedData.microchipDate ? new Date(sanitizedData.microchipDate) : undefined,
    microchipLocation: sanitizedData.microchipLocation || undefined,
    tattooNumber: sanitizedData.tattooNumber || undefined,
    isSterilized: sanitizedData.isSterilized,
    sterilizationDate: sanitizedData.sterilizationDate ? new Date(sanitizedData.sterilizationDate) : undefined,
    sterilizationTypeId: sanitizedData.sterilizationTypeId as number | undefined,
    registrationNumber: sanitizedData.registrationNumber || undefined,
    isActive: sanitizedData.isActive,
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
      (sanitized[field] as any) = undefined
    }
  })

  // Convert empty strings to undefined for optional number fields
  const optionalNumberFields: (keyof PetFormData)[] = [
    'breedId', 'primaryColorId', 'secondaryColorId', 'sterilizationTypeId'
  ]

  optionalNumberFields.forEach(field => {
    if (sanitized[field] === "") {
      (sanitized[field] as any) = undefined
    }
  })

  // Convert empty strings to undefined for optional date fields
  const optionalDateFields: (keyof PetFormData)[] = [
    'dateOfBirth', 'microchipDate', 'sterilizationDate', 'dateOfDeath', 'acquisitionDate'
  ]

  optionalDateFields.forEach(field => {
    if (sanitized[field] === "") {
      (sanitized[field] as any) = undefined
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
import type { PetFormData } from "../types/PetForm.types"
  import type { Pet } from "@/lib/database/database"

  /**
   * Transform form data to database format
   */
  export function transformFormDataToPet(formData: PetFormData): Omit<Pet, "id" | "createdAt" | "updatedAt"> {
    // Convert empty strings to undefined for database
    const sanitizedData = sanitizeFormData(formData)

    return {
      petNumber: sanitizedData.petNumber,
      ownerId: sanitizedData.ownerId as number,
      name: sanitizedData.name,
      speciesId: sanitizedData.speciesId as number,
      breedId: sanitizedData.breedId as number | undefined,
      sexId: sanitizedData.sexId as number,
      primaryColorId: sanitizedData.primaryColorId as number | undefined,
      secondaryColorId: sanitizedData.secondaryColorId as number | undefined,
      dateOfBirth: sanitizedData.dateOfBirth ? new Date(sanitizedData.dateOfBirth) : undefined,
      isBirthEstimated: sanitizedData.isBirthEstimated,
      microchipNumber: sanitizedData.microchipNumber || undefined,
      microchipDate: sanitizedData.microchipDate ? new Date(sanitizedData.microchipDate) : undefined,
      microchipLocation: sanitizedData.microchipLocation || undefined,
      tattooNumber: sanitizedData.tattooNumber || undefined,
      isSterilized: sanitizedData.isSterilized,
      sterilizationDate: sanitizedData.sterilizationDate ? new Date(sanitizedData.sterilizationDate) : undefined,
      sterilizationTypeId: sanitizedData.sterilizationTypeId as number | undefined,
      registrationNumber: sanitizedData.registrationNumber || undefined,
      isActive: sanitizedData.isActive,
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
        (sanitized[field] as any) = undefined
      }
    })

    // Convert empty strings to undefined for optional number fields
    const optionalNumberFields: (keyof PetFormData)[] = [
      'breedId', 'primaryColorId', 'secondaryColorId', 'sterilizationTypeId'
    ]

    optionalNumberFields.forEach(field => {
      if (sanitized[field] === "") {
        (sanitized[field] as any) = undefined
      }
    })

    // Convert empty strings to undefined for optional date fields
    const optionalDateFields: (keyof PetFormData)[] = [
      'dateOfBirth', 'microchipDate', 'sterilizationDate', 'dateOfDeath', 'acquisitionDate'
    ]

    optionalDateFields.forEach(field => {
      if (sanitized[field] === "") {
        (sanitized[field] as any) = undefined
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
      if (JSON.stringify(current[key]) !== JSON.stringify(original[key])) {
        changes[key] = current[key]
      }
    })

    return changes
  }

  // Re-export date formatting utility
  import { formatDateForInput } from "./date-utils"
  export { formatDateForInput }