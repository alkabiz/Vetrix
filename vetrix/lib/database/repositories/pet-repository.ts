import Database from "better-sqlite3"
import { getDatabase } from "../database"
import { Pet } from "../types/common.types"

/**
 * Retrieves all pets from the database, optionally filtering by owner ID.
 * Includes the owner's name in the result.
 * @param ownerId Optional owner ID to filter by.
 * @returns An array of Pet objects with owner_name.
 */
export function getPets(ownerId?: number): Pet[] {
    try {
        const db = getDatabase()
        let query = `
      SELECT p.*, o.firstName || ' ' || o.lastName as owner_name
      FROM mas_pets p
      LEFT JOIN mas_owners o ON p.ownerId = o.id
      WHERE p.isActive = 1
    `

        if (ownerId) {
            query += ` AND p.ownerId = @ownerId`
        }

        query += ` ORDER BY p.name`

        const stmt = db.prepare<unknown[], Pet>(query)
        return ownerId ? stmt.all({ ownerId }) : stmt.all()
    } catch (error) {
        console.error("Error fetching pets:", error)
        throw new Error("Failed to retrieve pets")
    }
}

/**
 * Retrieves a single pet by ID.
 * @param id The ID of the pet to retrieve.
 * @returns The Pet object if found, otherwise undefined.
 */
export function getPetById(id: number): Pet | undefined {
    try {
        const db = getDatabase()
        const stmt = db.prepare<[number], Pet>(`
      SELECT p.*, o.firstName || ' ' || o.lastName as owner_name
      FROM mas_pets p
      LEFT JOIN mas_owners o ON p.ownerId = o.id
      WHERE p.id = ?
    `)
        return stmt.get(id)
    } catch (error) {
        console.error(`Error fetching pet with ID ${id}:`, error)
        throw new Error(`Failed to retrieve pet with ID ${id}`)
    }
}

/**
 * Creates a new pet in the database.
 * @param data The pet data to insert.
 * @returns The result of the insertion operation.
 */
export function createPet(data: Omit<Pet, "id" | "createdAt" | "updatedAt" | "owner_name">): Database.RunResult {
    try {
        const db = getDatabase()
        const stmt = db.prepare(`
      INSERT INTO mas_pets (
        petNumber, ownerId, name, speciesId, breedId, sexId,
        primaryColorId, secondaryColorId, dateOfBirth, isBirthEstimated,
        microchipNumber, microchipDate, microchipLocation, tattooNumber,
        isSterilized, sterilizationDate, sterilizationTypeId, registrationNumber,
        isActive, dateOfDeath, causeOfDeath, specialNeeds, behavioralNotes,
        dietaryRestrictions, exerciseRequirements, acquisitionDate,
        acquisitionSource, previousOwnerInfo, createdAt, updatedAt
      ) VALUES (
        @petNumber, @ownerId, @name, @speciesId, @breedId, @sexId,
        @primaryColorId, @secondaryColorId, @dateOfBirth, @isBirthEstimated,
        @microchipNumber, @microchipDate, @microchipLocation, @tattooNumber,
        @isSterilized, @sterilizationDate, @sterilizationTypeId, @registrationNumber,
        @isActive, @dateOfDeath, @causeOfDeath, @specialNeeds, @behavioralNotes,
        @dietaryRestrictions, @exerciseRequirements, @acquisitionDate,
        @acquisitionSource, @previousOwnerInfo, @createdAt, @updatedAt
      )
    `)

        const now = new Date()
        return stmt.run({
            ...data,
            isActive: data.isActive ? 1 : 0,
            isBirthEstimated: data.isBirthEstimated ? 1 : 0,
            isSterilized: data.isSterilized ? 1 : 0,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        })
    } catch (error) {
        console.error("Error creating pet:", error)
        throw new Error("Failed to create pet")
    }
}

/**
 * Updates an existing pet in the database.
 * @param id The ID of the pet to update.
 * @param data The partial pet data to update.
 * @returns The result of the update operation.
 */
export function updatePet(id: number, data: Partial<Omit<Pet, "id" | "createdAt" | "updatedAt" | "owner_name">>): Database.RunResult {
    try {
        const db = getDatabase()

        const fields = Object.keys(data)
            .map((key) => `${key} = @${key}`)
            .join(", ")

        if (fields.length === 0) {
            throw new Error("No fields to update")
        }

        const stmt = db.prepare(`
      UPDATE mas_pets
      SET ${fields}, updatedAt = @updatedAt
      WHERE id = @id
    `)

        return stmt.run({
            ...data,
            id,
            updatedAt: new Date().toISOString(),
        })
    } catch (error) {
        console.error(`Error updating pet with ID ${id}:`, error)
        throw new Error(`Failed to update pet with ID ${id}`)
    }
}

/**
 * Soft deletes a pet by setting isActive to false.
 * @param id The ID of the pet to delete.
 * @returns The result of the delete operation.
 */
export function deletePet(id: number): Database.RunResult {
    try {
        const db = getDatabase()
        const stmt = db.prepare(`
      UPDATE mas_pets SET isActive = 0, updatedAt = @updatedAt WHERE id = ?
    `)
        return stmt.run(new Date().toISOString(), id)
    } catch (error) {
        console.error(`Error deleting pet with ID ${id}:`, error)
        throw new Error(`Failed to delete pet with ID ${id}`)
    }
}
