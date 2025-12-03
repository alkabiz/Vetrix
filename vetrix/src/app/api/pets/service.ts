import { getDatabase } from "@/lib/database/database"
import { PetDTO, PetInput, PetUpdateInput } from "@/lib/api/types/pet.types"
import { NotFoundError, ValidationError } from "@/lib/core/errors/api-errors"

export class PetService {
    static getAll(): PetDTO[] {
        const db = getDatabase()
        const pets = db
            .prepare(`
                SELECT 
                    p.*,
                    o.first_name || ' ' || o.last_name as owner_name,
                    s.name as species_name,
                    b.name as breed_name,
                    sex.name as sex_name,
                    c1.name as primaryColor_name,
                    c2.name as secondaryColor_name
                FROM mas_pets p 
                LEFT JOIN mas_owners o ON p.owner_id = o.id 
                LEFT JOIN cat_species s ON p.species_id = s.id
                LEFT JOIN cat_breeds b ON p.breed_id = b.id
                LEFT JOIN cat_sexes sex ON p.sex_id = sex.id
                LEFT JOIN cat_colors c1 ON p.primary_color_id = c1.id
                LEFT JOIN cat_colors c2 ON p.secondary_color_id = c2.id
                ORDER BY p.name
            `)
            .all() as any[]

        return pets.map(pet => this.mapToPetDTO(pet))
    }

    static getById(id: string): PetDTO {
        const numericId = Number(id)
        if (isNaN(numericId) || numericId <= 0) {
            throw new ValidationError("Invalid ID parameter")
        }

        const db = getDatabase()
        const pet = db
            .prepare(`
                SELECT 
                    p.*,
                    o.first_name || ' ' || o.last_name as owner_name,
                    s.name as species_name,
                    b.name as breed_name,
                    sex.name as sex_name,
                    c1.name as primaryColor_name,
                    c2.name as secondaryColor_name
                FROM mas_pets p 
                LEFT JOIN mas_owners o ON p.owner_id = o.id 
                LEFT JOIN cat_species s ON p.species_id = s.id
                LEFT JOIN cat_breeds b ON p.breed_id = b.id
                LEFT JOIN cat_sexes sex ON p.sex_id = sex.id
                LEFT JOIN cat_colors c1 ON p.primary_color_id = c1.id
                LEFT JOIN cat_colors c2 ON p.secondary_color_id = c2.id
                WHERE p.id = ?
            `)
            .get(numericId) as any

        if (!pet) {
            throw new NotFoundError("Pet not found")
        }

        return this.mapToPetDTO(pet)
    }

    static create(data: PetInput): PetDTO {
        const db = getDatabase()

        // Generate pet number if not provided
        const petNumber = data.petNumber || this.generatePetNumber()

        const stmt = db.prepare(`
            INSERT INTO mas_pets (
                pet_number, owner_id, name, species_id, breed_id, sex_id,
                primary_color_id, secondary_color_id, date_of_birth, is_birth_estimated,
                microchip_number, microchip_date, microchip_location, tattoo_number,
                is_sterilized, sterilization_date, sterilization_type_id,
                registration_number, is_active, special_needs, behavioral_notes,
                dietary_restrictions, exercise_requirements, acquisition_date,
                acquisition_source, previous_owner_info
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)

        const result = stmt.run(
            petNumber,
            data.ownerId,
            data.name,
            data.speciesId,
            data.breedId || null,
            data.sexId,
            data.primaryColorId || null,
            data.secondaryColorId || null,
            data.dateOfBirth || null,
            data.isBirthEstimated ? 1 : 0,
            data.microchipNumber || null,
            data.microchipDate || null,
            data.microchipLocation || null,
            data.tattooNumber || null,
            data.isSterilized ? 1 : 0,
            data.sterilizationDate || null,
            data.sterilizationTypeId || null,
            data.registrationNumber || null,
            data.isActive !== false ? 1 : 0,
            data.specialNeeds || null,
            data.behavioralNotes || null,
            data.dietaryRestrictions || null,
            data.exerciseRequirements || null,
            data.acquisitionDate || null,
            data.acquisitionSource || null,
            data.previousOwnerInfo || null
        )

        return this.getById(result.lastInsertRowid.toString())
    }

    static update(id: string, data: PetUpdateInput): PetDTO {
        const numericId = Number(id)
        if (isNaN(numericId) || numericId <= 0) {
            throw new ValidationError("Invalid ID parameter")
        }

        // Verify pet exists
        this.getById(id)

        const db = getDatabase()
        const fields: string[] = []
        const values: any[] = []

        // Map object properties to database column names
        const fieldMapping: Record<string, string> = {
            ownerId: 'owner_id',
            name: 'name',
            speciesId: 'species_id',
            breedId: 'breed_id',
            sexId: 'sex_id',
            primaryColorId: 'primary_color_id',
            secondaryColorId: 'secondary_color_id',
            dateOfBirth: 'date_of_birth',
            isBirthEstimated: 'is_birth_estimated',
            microchipNumber: 'microchip_number',
            microchipDate: 'microchip_date',
            microchipLocation: 'microchip_location',
            tattooNumber: 'tattoo_number',
            isSterilized: 'is_sterilized',
            sterilizationDate: 'sterilization_date',
            sterilizationTypeId: 'sterilization_type_id',
            registrationNumber: 'registration_number',
            isActive: 'is_active',
            dateOfDeath: 'date_of_death',
            causeOfDeath: 'cause_of_death',
            specialNeeds: 'special_needs',
            behavioralNotes: 'behavioral_notes',
            dietaryRestrictions: 'dietary_restrictions',
            exerciseRequirements: 'exercise_requirements',
            acquisitionDate: 'acquisition_date',
            acquisitionSource: 'acquisition_source',
            previousOwnerInfo: 'previous_owner_info'
        }

        Object.keys(data).forEach(key => {
            const dbColumn = fieldMapping[key]
            if (dbColumn && data[key as keyof PetUpdateInput] !== undefined) {
                fields.push(`${dbColumn} = ?`)
                let value = data[key as keyof PetUpdateInput]
                // Convert boolean to integer for SQLite
                if (typeof value === 'boolean') {
                    value = value ? 1 : 0
                }
                values.push(value)
            }
        })

        if (fields.length === 0) {
            return this.getById(id)
        }

        const stmt = db.prepare(`
            UPDATE mas_pets 
            SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `)

        stmt.run(...values, numericId)

        return this.getById(id)
    }

    static delete(id: string): void {
        const numericId = Number(id)
        if (isNaN(numericId) || numericId <= 0) {
            throw new ValidationError("Invalid ID parameter")
        }

        const db = getDatabase()
        const result = db.prepare("DELETE FROM mas_pets WHERE id = ?").run(numericId)

        if (result.changes === 0) {
            throw new NotFoundError("Pet not found")
        }
    }

    /**
     * Generate a unique pet number
     */
    private static generatePetNumber(): string {
        const db = getDatabase()
        const result = db.prepare("SELECT COUNT(*) as count FROM mas_pets").get() as { count: number }
        const nextNumber = (result.count + 1).toString().padStart(6, '0')
        return `PET${nextNumber}`
    }

    /**
     * Map database row to PetDTO with calculated age
     */
    private static mapToPetDTO(pet: any): PetDTO {
        // Calculate age from date of birth
        let age: number | undefined
        if (pet.date_of_birth) {
            const birthDate = new Date(pet.date_of_birth)
            const today = new Date()
            age = today.getFullYear() - birthDate.getFullYear()
            const m = today.getMonth() - birthDate.getMonth()
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--
            }
        }

        return {
            id: pet.id,
            petNumber: pet.pet_number,
            ownerId: pet.owner_id,
            name: pet.name,
            speciesId: pet.species_id,
            breedId: pet.breed_id,
            sexId: pet.sex_id,
            primaryColorId: pet.primary_color_id,
            secondaryColorId: pet.secondary_color_id,
            dateOfBirth: pet.date_of_birth,
            isBirthEstimated: Boolean(pet.is_birth_estimated),
            microchipNumber: pet.microchip_number,
            microchipDate: pet.microchip_date,
            microchipLocation: pet.microchip_location,
            tattooNumber: pet.tattoo_number,
            isSterilized: pet.is_sterilized !== null ? Boolean(pet.is_sterilized) : undefined,
            sterilizationDate: pet.sterilization_date,
            sterilizationTypeId: pet.sterilization_type_id,
            registrationNumber: pet.registration_number,
            isActive: Boolean(pet.is_active),
            dateOfDeath: pet.date_of_death,
            causeOfDeath: pet.cause_of_death,
            specialNeeds: pet.special_needs,
            behavioralNotes: pet.behavioral_notes,
            dietaryRestrictions: pet.dietary_restrictions,
            exerciseRequirements: pet.exercise_requirements,
            acquisitionDate: pet.acquisition_date,
            acquisitionSource: pet.acquisition_source,
            previousOwnerInfo: pet.previous_owner_info,
            createdAt: pet.created_at,
            updatedAt: pet.updated_at,
            // Display fields
            owner_name: pet.owner_name,
            species_name: pet.species_name,
            breed_name: pet.breed_name,
            sex_name: pet.sex_name,
            primaryColor_name: pet.primaryColor_name,
            secondaryColor_name: pet.secondaryColor_name,
            age
        }
    }
}
