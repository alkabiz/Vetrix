import Database from "better-sqlite3"
import { getDatabase } from "../database"
import { Owner } from "../types/common.types"

/**
 * Retrieves all owners from the database.
 * @returns An array of Owner objects.
 */
export function getOwners(): Owner[] {
    try {
        const db = getDatabase()
        const stmt = db.prepare<[], Owner>(`
      SELECT * FROM mas_owners WHERE isActive = 1 ORDER BY lastName, firstName
    `)
        return stmt.all()
    } catch (error) {
        console.error("Error fetching owners:", error)
        throw new Error("Failed to retrieve owners")
    }
}

/**
 * Retrieves a single owner by ID.
 * @param id The ID of the owner to retrieve.
 * @returns The Owner object if found, otherwise undefined.
 */
export function getOwnerById(id: number): Owner | undefined {
    try {
        const db = getDatabase()
        const stmt = db.prepare<[number], Owner>(`
      SELECT * FROM mas_owners WHERE id = ?
    `)
        return stmt.get(id)
    } catch (error) {
        console.error(`Error fetching owner with ID ${id}:`, error)
        throw new Error(`Failed to retrieve owner with ID ${id}`)
    }
}

/**
 * Creates a new owner in the database.
 * @param data The owner data to insert.
 * @returns The result of the insertion operation.
 */
export function createOwner(data: Omit<Owner, "id" | "createdAt" | "updatedAt">): Database.RunResult {
    try {
        const db = getDatabase()
        const stmt = db.prepare(`
      INSERT INTO mas_owners (
        firstName, lastName, phonePrimary, phoneSecondary, email,
        addressStreet, cityId, addressPostalCode, dateOfBirth,
        identificationTypeId, identificationNumber, emergencyContactName,
        emergencyContactPhone, emergencyContactRelationship, marketingConsent,
        dataProcessingConsent, isActive, creditLimit, notes, createdAt, updatedAt
      ) VALUES (
        @firstName, @lastName, @phonePrimary, @phoneSecondary, @email,
        @addressStreet, @cityId, @addressPostalCode, @dateOfBirth,
        @identificationTypeId, @identificationNumber, @emergencyContactName,
        @emergencyContactPhone, @emergencyContactRelationship, @marketingConsent,
        @dataProcessingConsent, @isActive, @creditLimit, @notes, @createdAt, @updatedAt
      )
    `)

        const now = new Date()
        return stmt.run({
            ...data,
            isActive: data.isActive ? 1 : 0,
            marketingConsent: data.marketingConsent ? 1 : 0,
            dataProcessingConsent: data.dataProcessingConsent ? 1 : 0,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        })
    } catch (error) {
        console.error("Error creating owner:", error)
        throw new Error("Failed to create owner")
    }
}

/**
 * Updates an existing owner in the database.
 * @param id The ID of the owner to update.
 * @param data The partial owner data to update.
 * @returns The result of the update operation.
 */
export function updateOwner(id: number, data: Partial<Omit<Owner, "id" | "createdAt" | "updatedAt">>): Database.RunResult {
    try {
        const db = getDatabase()

        const fields = Object.keys(data)
            .map((key) => `${key} = @${key}`)
            .join(", ")

        if (fields.length === 0) {
            throw new Error("No fields to update")
        }

        const stmt = db.prepare(`
      UPDATE mas_owners
      SET ${fields}, updatedAt = @updatedAt
      WHERE id = @id
    `)

        return stmt.run({
            ...data,
            id,
            updatedAt: new Date().toISOString(),
        })
    } catch (error) {
        console.error(`Error updating owner with ID ${id}:`, error)
        throw new Error(`Failed to update owner with ID ${id}`)
    }
}

/**
 * Soft deletes an owner by setting isActive to false.
 * @param id The ID of the owner to delete.
 * @returns The result of the delete operation.
 */
export function deleteOwner(id: number): Database.RunResult {
    try {
        const db = getDatabase()
        const stmt = db.prepare(`
      UPDATE mas_owners SET isActive = 0, updatedAt = @updatedAt WHERE id = ?
    `)
        return stmt.run(new Date().toISOString(), id)
    } catch (error) {
        console.error(`Error deleting owner with ID ${id}:`, error)
        throw new Error(`Failed to delete owner with ID ${id}`)
    }
}
