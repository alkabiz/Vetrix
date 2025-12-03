import { Pet } from "@/lib/database/database"

export interface PetEntity extends Pet { }

/**
 * Pet Data Transfer Object with display fields for UI
 */
export interface PetDTO extends Omit<PetEntity, 'dateOfBirth' | 'microchipDate' | 'sterilizationDate' | 'dateOfDeath' | 'acquisitionDate' | 'createdAt' | 'updatedAt'> {
    // Relational display fields
    owner_name?: string
    species_name?: string
    breed_name?: string
    sex_name?: string
    primaryColor_name?: string
    secondaryColor_name?: string

    // Computed fields
    age?: number // Calculated from dateOfBirth

    // Date fields as ISO strings for JSON serialization
    dateOfBirth?: string
    microchipDate?: string
    sterilizationDate?: string
    dateOfDeath?: string
    acquisitionDate?: string
    createdAt: string
    updatedAt: string
}

/**
 * Input type for creating a new pet
 */
export interface PetInput {
    petNumber?: string // Optional, can be auto-generated
    ownerId: number
    name: string
    speciesId: number
    breedId?: number
    sexId: number
    primaryColorId?: number
    secondaryColorId?: number

    dateOfBirth?: string // ISO date string
    isBirthEstimated: boolean

    microchipNumber?: string
    microchipDate?: string
    microchipLocation?: string
    tattooNumber?: string

    isSterilized?: boolean
    sterilizationDate?: string
    sterilizationTypeId?: number

    registrationNumber?: string

    isActive?: boolean

    specialNeeds?: string
    behavioralNotes?: string
    dietaryRestrictions?: string
    exerciseRequirements?: string

    acquisitionDate?: string
    acquisitionSource?: string
    previousOwnerInfo?: string
}

/**
 * Input type for updating an existing pet (all fields optional except ID)
 */
export interface PetUpdateInput {
    ownerId?: number
    name?: string
    speciesId?: number
    breedId?: number
    sexId?: number
    primaryColorId?: number
    secondaryColorId?: number

    dateOfBirth?: string
    isBirthEstimated?: boolean

    microchipNumber?: string
    microchipDate?: string
    microchipLocation?: string
    tattooNumber?: string

    isSterilized?: boolean
    sterilizationDate?: string
    sterilizationTypeId?: number

    registrationNumber?: string

    isActive?: boolean
    dateOfDeath?: string
    causeOfDeath?: string

    specialNeeds?: string
    behavioralNotes?: string
    dietaryRestrictions?: string
    exerciseRequirements?: string

    acquisitionDate?: string
    acquisitionSource?: string
    previousOwnerInfo?: string
}

