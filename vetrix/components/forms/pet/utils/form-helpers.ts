import type { PetFormData } from "../types/PetForm.types"
import { DEFAULT_PET_FORM_VALUES } from "../types/form-data.types"
import type { Pet } from "@/lib/database/database"
import { formatDateForInput } from "./date-utils"

/**
 * Generate a unique pet number following the pattern PET + timestamp
 */
export function generatePetNumber(): string {
  const timestamp = Date.now().toString()
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `PET${timestamp.slice(-6)}${randomSuffix}`
}

/**
 * Get initial form data for a new pet
 */
export function getInitialFormData(): PetFormData {
  const petNumber = generatePetNumber()
  const today = new Date().toISOString().split('T')[0]

  return {
    ...DEFAULT_PET_FORM_VALUES,
    petNumber,
    acquisitionDate: today,
  }
}

/**
 * Initialize form data from an existing Pet object
 */
export function initializeFormFromPet(pet: Pet): PetFormData {
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
 * Check if form has changes compared to original data
 */
export function hasFormChanges(current: PetFormData, original: PetFormData): boolean {
  // Simple deep comparison for form data
  const currentJson = JSON.stringify(normalizeFormData(current))
  const originalJson = JSON.stringify(normalizeFormData(original))

  return currentJson !== originalJson
}

/**
 * Normalize form data for comparison (convert empty strings to null, etc.)
 */
export function normalizeFormData(formData: PetFormData): Partial<PetFormData> {
  const normalized = { ...formData }

  // Convert empty strings to null for optional fields
  const optionalFields: (keyof PetFormData)[] = [
    'breedId', 'primaryColorId', 'secondaryColorId', 'microchipNumber',
    'microchipDate', 'microchipLocation', 'tattooNumber', 'sterilizationDate',
    'sterilizationTypeId', 'registrationNumber', 'dateOfDeath', 'causeOfDeath',
    'specialNeeds', 'behavioralNotes', 'dietaryRestrictions', 'exerciseRequirements',
    'acquisitionDate', 'acquisitionSource', 'previousOwnerInfo'
  ]

  optionalFields.forEach(field => {
    if (normalized[field] === "") {
      (normalized[field] as any) = null
    }
  })

  return normalized
}

/**
 * Validate required fields are filled
 */
export function validateRequiredFields(formData: PetFormData): string[] {
  const errors: string[] = []
  const requiredFields: (keyof PetFormData)[] = [
    'petNumber', 'ownerId', 'name', 'speciesId', 'sexId'
  ]

  requiredFields.forEach(field => {
    const value = formData[field]
    if (value === "" || value === null || value === undefined) {
      errors.push(`${field} is required`)
    }
  })

  return errors
}

/**
 * Get field display value for summary or preview
 */
export function getFieldDisplayValue(
  field: keyof PetFormData,
  value: any,
  options?: { [key: string]: string }
): string {
  if (value === "" || value === null || value === undefined) {
    return "Not specified"
  }

  // Handle boolean values
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  // Handle date values
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(value).toLocaleDateString()
  }

  // Handle options (like species, breed, etc.)
  if (options && options[value]) {
    return options[value]
  }

  return String(value)
}

// Re-export from date-utils for convenience
export { formatDateForInput }