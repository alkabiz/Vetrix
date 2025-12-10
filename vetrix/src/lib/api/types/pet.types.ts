// Pet entity and DTO types based on database schema

export interface PetEntity {
    id: number
    pet_number: string
    owner_id: number
    name: string
    species_id: number
    breed_id?: number | null
    sex_id: number
    primary_color_id?: number | null
    secondary_color_id?: number | null
    date_of_birth?: string | null
    is_birth_estimated: boolean
    microchip_number?: string | null
    microchip_date?: string | null
    microchip_location?: string | null
    tattoo_number?: string | null
    is_sterilized?: boolean | null
    sterilization_date?: string | null
    sterilization_type_id?: number | null
    registration_number?: string | null
    is_active: boolean
    date_of_death?: string | null
    cause_of_death?: string | null
    special_needs?: string | null
    behavioral_notes?: string | null
    dietary_restrictions?: string | null
    exercise_requirements?: string | null
    acquisition_date?: string | null
    acquisition_source?: string | null
    previous_owner_info?: string | null
    created_at: string
    updated_at: string
}

export interface PetDTO extends Omit<PetEntity, 'owner_id' | 'species_id' | 'breed_id' | 'sex_id' | 'primary_color_id' | 'secondary_color_id' | 'sterilization_type_id' | 'pet_number' | 'date_of_birth' | 'is_birth_estimated' | 'microchip_number' | 'microchip_date' | 'microchip_location' | 'tattoo_number' | 'is_sterilized' | 'sterilization_date' | 'registration_number' | 'is_active' | 'date_of_death' | 'cause_of_death' | 'special_needs' | 'behavioral_notes' | 'dietary_restrictions' | 'exercise_requirements' | 'acquisition_date' | 'acquisition_source' | 'previous_owner_info' | 'created_at' | 'updated_at'> {
    // Camel case properties for DTO
    petNumber: string
    ownerId: number
    speciesId: number
    breedId?: number | null
    sexId: number
    primaryColorId?: number | null
    secondaryColorId?: number | null
    dateOfBirth?: string | null
    isBirthEstimated: boolean
    microchipNumber?: string | null
    microchipDate?: string | null
    microchipLocation?: string | null
    tattooNumber?: string | null
    isSterilized?: boolean | null
    sterilizationDate?: string | null
    sterilizationTypeId?: number | null
    registrationNumber?: string | null
    isActive: boolean
    dateOfDeath?: string | null
    causeOfDeath?: string | null
    specialNeeds?: string | null
    behavioralNotes?: string | null
    dietaryRestrictions?: string | null
    exerciseRequirements?: string | null
    acquisitionDate?: string | null
    acquisitionSource?: string | null
    previousOwnerInfo?: string | null
    createdAt: string
    updatedAt: string
    // Display/computed fields
    owner_name?: string
    species_name?: string
    breed_name?: string
    sex_name?: string
    primaryColor_name?: string
    secondaryColor_name?: string
    age?: number
}

export interface PetInput {
    petNumber?: string
    ownerId: number
    name: string
    speciesId: number
    breedId?: number
    sexId: number
    primaryColorId?: number
    secondaryColorId?: number
    dateOfBirth?: string
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

export type PetUpdateInput = Partial<PetInput>
