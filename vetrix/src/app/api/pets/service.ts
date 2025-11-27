import { getDatabase } from "@/lib/database/database"
import { type PetInput, type PetUpdateInput } from "./validator"
import { PetDTO, PetEntity } from "@/lib/api/types/pet.types"
import { NotFoundError, ValidationError } from "@/lib/core/errors/api-errors"

export class PetService {
    static getAll(): PetDTO[] {
        const db = getDatabase()
        return db
            .prepare(`
      SELECT p.*, o.name as owner_name 
      FROM pets p 
      JOIN owners o ON p.owner_id = o.id 
      ORDER BY p.name
    `)
            .all() as PetDTO[]
    }

    static getById(id: string): PetDTO {
        const numericId = Number(id)
        if (isNaN(numericId) || numericId <= 0) {
            throw new ValidationError("Invalid ID parameter")
        }

        const db = getDatabase()
        const pet = db
            .prepare(`
      SELECT p.*, o.name as owner_name 
      FROM pets p 
      JOIN owners o ON p.owner_id = o.id 
      WHERE p.id = ?
    `)
            .get(numericId) as PetDTO

        if (!pet) {
            throw new NotFoundError("Pet not found")
        }

        return pet
    }

    static create(data: PetInput): PetDTO {
        const db = getDatabase()

        const stmt = db.prepare(`
      INSERT INTO pets (owner_id, name, species, breed, sex, age, weight, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

        const result = stmt.run(
            data.owner_id,
            data.name,
            data.species,
            data.breed,
            data.sex,
            data.age,
            data.weight,
            data.notes
        )

        return this.getById(result.lastInsertRowid.toString())
    }

    static update(id: string, data: PetUpdateInput): PetDTO {
        const numericId = Number(id)
        if (isNaN(numericId) || numericId <= 0) {
            throw new ValidationError("Invalid ID parameter")
        }

        const db = getDatabase()

        // Filter out undefined values
        const fields = Object.keys(data).filter(key => data[key as keyof PetUpdateInput] !== undefined)
        if (fields.length === 0) {
            return this.getById(id)
        }

        const setClause = fields.map(field => `${field} = ?`).join(", ")
        const values = fields.map(field => data[field as keyof PetUpdateInput])

        const stmt = db.prepare(`
            UPDATE pets 
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `)

        const result = stmt.run(...values, numericId)

        if (result.changes === 0) {
            throw new NotFoundError("Pet not found")
        }

        return this.getById(id)
    }

    static delete(id: string): void {
        const numericId = Number(id)
        if (isNaN(numericId) || numericId <= 0) {
            throw new ValidationError("Invalid ID parameter")
        }

        const db = getDatabase()
        const result = db.prepare("DELETE FROM pets WHERE id = ?").run(numericId)

        if (result.changes === 0) {
            throw new NotFoundError("Pet not found")
        }
    }
}
