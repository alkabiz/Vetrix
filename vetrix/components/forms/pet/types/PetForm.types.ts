import type { Pet, Owner, Species, Breed, Color, Sex, SterilizationType } from "@/lib/database/database"
import type { z } from "zod"
import { petBasicInfoSchema, petBehaviorSchema, petFormSchema, petIdentificationSchema, petMedicalInfoSchema } from "./validation.schemas"

// Main component props
export interface PetFormProps {
  pet?: Pet | null
  owners: Owner[]
  species: Species[]
  breeds: Breed[]
  colors: Color[]
  sexes: Sex[]
  sterilizationTypes: SterilizationType[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (pet: Omit<Pet, "id" | "createdAt" | "updatedAt">) => Promise<void>
}

// Form data type matching database schema
export type PetFormData = {
  petNumber: string
  ownerId: number | ""
  name: string
  speciesId: number | ""
  breedId: number | ""
  sexId: number | ""
  primaryColorId: number | ""
  secondaryColorId: number | ""
  dateOfBirth: string
  isBirthEstimated: boolean
  microchipNumber: string
  microchipDate: string
  microchipLocation: string
  tattooNumber: string
  isSterilized: boolean
  sterilizationDate: string
  sterilizationTypeId: number | ""
  registrationNumber: string
  isActive: boolean
  dateOfDeath: string
  causeOfDeath: string
  specialNeeds: string
  behavioralNotes: string
  dietaryRestrictions: string
  exerciseRequirements: string
  acquisitionDate: string
  acquisitionSource: string
  previousOwnerInfo: string
}

// Derived types for form sections
export type BasicInformationData = Pick<
  PetFormData,
  | "petNumber"
  | "ownerId"
  | "name"
  | "speciesId"
  | "breedId"
  | "sexId"
  | "primaryColorId"
  | "secondaryColorId"
>

export type BirthAndAgeData = Pick<
  PetFormData,
  "dateOfBirth" | "isBirthEstimated"
>

export type IdentificationData = Pick<
  PetFormData,
  | "microchipNumber"
  | "microchipDate"
  | "microchipLocation"
  | "tattooNumber"
  | "registrationNumber"
>

export type MedicalInformationData = Pick<
  PetFormData,
  | "isSterilized"
  | "sterilizationDate"
  | "sterilizationTypeId"
  | "specialNeeds"
  | "dietaryRestrictions"
  | "dateOfDeath"
  | "causeOfDeath"
  | "dateOfBirth"
>

export type BehavioralAndCareData = Pick<
  PetFormData,
  "behavioralNotes" | "exerciseRequirements"
>

export type AcquisitionInformationData = Pick<
  PetFormData,
  "acquisitionDate" | "acquisitionSource" | "previousOwnerInfo"
>

// Form validation errors
export type PetFormErrors = {
  [K in keyof PetFormData]?: string
} & {
  submit?: string
  _form?: string
}

// Section props interfaces
export interface BasicInformationSectionProps {
  formData: BasicInformationData
  errors: PetFormErrors
  owners: Owner[]
  species: Species[]
  breeds: Breed[]
  colors: Color[]
  sexes: Sex[]
  onFieldChange: <K extends keyof BasicInformationData>(
    field: K,
    value: BasicInformationData[K]
  ) => void
  disabled?: boolean
}

export interface BirthAndAgeSectionProps {
  formData: BirthAndAgeData
  errors: PetFormErrors
  onFieldChange: <K extends keyof BirthAndAgeData>(
    field: K,
    value: BirthAndAgeData[K]
  ) => void
  disabled?: boolean
}

export interface IdentificationSectionProps {
  formData: IdentificationData
  errors: PetFormErrors
  onFieldChange: <K extends keyof IdentificationData>(
    field: K,
    value: IdentificationData[K]
  ) => void
  disabled?: boolean
}

export interface MedicalInformationSectionProps {
  formData: MedicalInformationData
  errors: PetFormErrors
  sterilizationTypes: SterilizationTypeOption[]
  onFieldChange: <K extends keyof MedicalInformationData>(
    field: K,
    value: MedicalInformationData[K]
  ) => void
  disabled?: boolean
}

export interface BehavioralAndCareSectionProps {
  formData: BehavioralAndCareData
  errors: PetFormErrors
  onFieldChange: <K extends keyof BehavioralAndCareData>(
    field: K,
    value: BehavioralAndCareData[K]
  ) => void
  disabled?: boolean
}

export interface AcquisitionInformationSectionProps {
  formData: AcquisitionInformationData
  errors: PetFormErrors
  onFieldChange: <K extends keyof AcquisitionInformationData>(
    field: K,
    value: AcquisitionInformationData[K]
  ) => void
  disabled?: boolean
}

// Dynamic option types
export interface SpeciesOption {
  id: number
  name: string
  scientificName?: string
}

export interface BreedOption {
  id: number
  name: string
  speciesId: number
}

export interface ColorOption {
  id: number
  name: string
  hexCode?: string
}

export interface SexOption {
  id: number
  name: string
  abbreviation: "M" | "F" | "U"
}

export interface SterilizationTypeOption {
  id: number
  code: string
  description: string
}

// Form configuration
export interface PetFormConfig {
  autoGeneratePetNumber: boolean
  requireMicrochipFormat: boolean
  minPetNameLength: number
  maxPetNameLength: number
  maxWeight: number
  allowFutureDates: boolean
  enableAdvancedMedical: boolean
}

// Hook props
export interface UsePetFormProps {
  pet?: Pet | null
  onSubmit: (pet: Omit<Pet, "id" | "createdAt" | "updatedAt">) => Promise<void>
}

// Hook return types
export interface UsePetFormReturn {
  formData: PetFormData
  errors: PetFormErrors
  isSubmitting: boolean
  isDirty: boolean
  handleFieldChange: <K extends keyof PetFormData>(
    field: K,
    value: PetFormData[K]
  ) => void
  handleSubmit: () => Promise<void>
  validateForm: () => boolean
  validateField: (field: keyof PetFormData) => boolean
  resetForm: () => void
}

// Type inference from Zod schemas
export type PetBasicInfoInput = z.infer<typeof petBasicInfoSchema>
export type PetMedicalInfoInput = z.infer<typeof petMedicalInfoSchema>
export type PetIdentificationInput = z.infer<typeof petIdentificationSchema>
export type PetBehaviorInput = z.infer<typeof petBehaviorSchema>
export type PetFormInput = z.infer<typeof petFormSchema>