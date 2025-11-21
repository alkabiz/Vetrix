import type { PetFormData } from "./PetForm.types"

// Default form values
export const DEFAULT_PET_FORM_VALUES: PetFormData = {
  petNumber: "",
  ownerId: "",
  name: "",
  speciesId: "",
  breedId: "",
  sexId: "",
  primaryColorId: "",
  secondaryColorId: "",
  dateOfBirth: "",
  isBirthEstimated: false,
  microchipNumber: "",
  microchipDate: "",
  microchipLocation: "",
  tattooNumber: "",
  isSterilized: false,
  sterilizationDate: "",
  sterilizationTypeId: "",
  registrationNumber: "",
  isActive: true,
  dateOfDeath: "",
  causeOfDeath: "",
  specialNeeds: "",
  behavioralNotes: "",
  dietaryRestrictions: "",
  exerciseRequirements: "",
  acquisitionDate: "",
  acquisitionSource: "",
  previousOwnerInfo: "",
}

// Form configuration
export const PET_FORM_CONFIG = {
  autoGeneratePetNumber: true,
  requireMicrochipFormat: true,
  minPetNameLength: 2,
  maxPetNameLength: 50,
  maxWeight: 1000, // kg
  allowFutureDates: false,
  enableAdvancedMedical: true,
} as const

// Field configuration
export const REQUIRED_FIELDS: (keyof PetFormData)[] = [
  "petNumber",
  "ownerId", 
  "name",
  "speciesId",
  "sexId",
]

// Conditional field dependencies
export const CONDITIONAL_FIELDS = {
  sterilization: {
    condition: "isSterilized",
    requiredFields: ["sterilizationDate", "sterilizationTypeId"] as (keyof PetFormData)[],
  },
  microchip: {
    condition: "microchipNumber",
    requiredFields: ["microchipDate"] as (keyof PetFormData)[],
  },
  death: {
    condition: "dateOfDeath", 
    requiredFields: ["causeOfDeath"] as (keyof PetFormData)[],
  },
} as const

// Field labels and placeholders
export const FIELD_LABELS: Record<keyof PetFormData, string> = {
  petNumber: "Pet Number",
  ownerId: "Owner",
  name: "Pet Name", 
  speciesId: "Species",
  breedId: "Breed",
  sexId: "Sex",
  primaryColorId: "Primary Color",
  secondaryColorId: "Secondary Color",
  dateOfBirth: "Date of Birth",
  isBirthEstimated: "Birth Date is Estimated",
  microchipNumber: "Microchip Number",
  microchipDate: "Microchip Date",
  microchipLocation: "Microchip Location",
  tattooNumber: "Tattoo Number",
  isSterilized: "Is Sterilized",
  sterilizationDate: "Sterilization Date",
  sterilizationTypeId: "Sterilization Type",
  registrationNumber: "Registration Number",
  isActive: "Is Active",
  dateOfDeath: "Date of Death",
  causeOfDeath: "Cause of Death",
  specialNeeds: "Special Needs",
  behavioralNotes: "Behavioral Notes",
  dietaryRestrictions: "Dietary Restrictions",
  exerciseRequirements: "Exercise Requirements",
  acquisitionDate: "Acquisition Date",
  acquisitionSource: "Acquisition Source",
  previousOwnerInfo: "Previous Owner Information",
}

export const FIELD_PLACEHOLDERS: Partial<Record<keyof PetFormData, string>> = {
  name: "Enter pet's name",
  microchipNumber: "15-digit hexadecimal code",
  microchipLocation: "e.g., Left shoulder, between shoulder blades",
  registrationNumber: "Breed registry or kennel club number",
  specialNeeds: "Any special medical needs or conditions...",
  dietaryRestrictions: "Food allergies, special diet requirements...",
  behavioralNotes: "Temperament, behavioral issues, training notes...",
  exerciseRequirements: "Exercise needs, activity level, restrictions...",
  acquisitionSource: "e.g., Breeder, Shelter, Rescue, Private",
  previousOwnerInfo: "Information about previous owners, if applicable...",
}