export interface Species {
    id: number
    name: string
    scientificName?: string
    averageLifespanYears?: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface Breed {
    id: number
    speciesId: number
    name: string
    sizeCategoryId?: number
    averageWeightMin?: number
    averageWeightMax?: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export interface Color {
    id: number
    name: string
    hexCode?: string
    isActive: boolean
    createdAt: Date
}

export interface Sex {
    id: number
    name: string
    abbreviation: "M" | "F" | "U"
    isActive: boolean
    createdAt: Date
}

export interface Owner {
    id: number
    firstName: string
    lastName: string
    phonePrimary?: string
    phoneSecondary?: string
    email?: string
    addressStreet?: string
    cityId?: number
    addressPostalCode?: string
    dateOfBirth?: Date
    identificationTypeId?: number
    identificationNumber?: string
    emergencyContactName?: string
    emergencyContactPhone?: string
    emergencyContactRelationship?: string
    marketingConsent: boolean
    dataProcessingConsent: boolean
    isActive: boolean
    creditLimit: number
    notes?: string
    createdAt: Date
    updatedAt: Date
    // Computed/Joined fields
    name?: string
}

export interface Pet {
    id: number
    petNumber: string
    ownerId: number
    name: string
    speciesId: number
    breedId?: number
    sexId: number
    primaryColorId?: number
    secondaryColorId?: number
    dateOfBirth?: Date
    isBirthEstimated: boolean
    microchipNumber?: string
    microchipDate?: Date
    microchipLocation?: string
    tattooNumber?: string
    isSterilized?: boolean
    sterilizationDate?: Date
    sterilizationTypeId?: number
    registrationNumber?: string
    isActive: boolean
    dateOfDeath?: Date
    causeOfDeath?: string
    specialNeeds?: string
    behavioralNotes?: string
    dietaryRestrictions?: string
    exerciseRequirements?: string
    acquisitionDate?: Date
    acquisitionSource?: string
    previousOwnerInfo?: string
    createdAt: Date
    updatedAt: Date
    // Computed/Joined fields
    owner_name?: string
}

export interface Address {
    street?: string
    cityId?: number
    postalCode?: string
    stateId?: number
    countryId?: number
}

export interface ContactInfo {
    phonePrimary?: string
    phoneSecondary?: string
    email?: string
}
