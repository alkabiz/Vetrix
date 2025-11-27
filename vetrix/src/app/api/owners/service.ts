import { getDatabase } from "@/lib/database/database"
import { type OwnerInput, type OwnerUpdateInput } from "./validator"
import { OwnerDTO, OwnerEntity } from "@/lib/api/types/owner.types"
import { NotFoundError, ValidationError } from "@/lib/core/errors/api-errors"

export class OwnerService {
    static getAll(): OwnerDTO[] {
        const db = getDatabase()
        return db.prepare("SELECT * FROM owners ORDER BY name").all() as OwnerDTO[]
    }

    static getById(id: string): OwnerDTO {
        const numericId = Number(id)
        if (isNaN(numericId) || numericId <= 0) {
            throw new ValidationError("Invalid ID parameter")
        }

        const db = getDatabase()
        const owner = db.prepare("SELECT * FROM owners WHERE id = ?").get(numericId) as OwnerDTO

        if (!owner) {
            throw new NotFoundError("Owner not found")
        }

        return owner
    }

    static create(data: OwnerInput): OwnerDTO {
        const db = getDatabase()

        const stmt = db.prepare(`
      INSERT INTO owners (name, phone, email, address)
      VALUES (?, ?, ?, ?)
    `)

        const result = stmt.run(data.name, data.phone, data.email, data.address)

        return this.getById(result.lastInsertRowid.toString())
    }

    static update(id: string, data: OwnerUpdateInput): OwnerDTO {
        const numericId = Number(id)
        if (isNaN(numericId) || numericId <= 0) {
            throw new ValidationError("Invalid ID parameter")
        }

        const db = getDatabase()

        // Filter out undefined values
        const fields = Object.keys(data).filter(key => data[key as keyof OwnerUpdateInput] !== undefined)
        if (fields.length === 0) {
            return this.getById(id)
        }

        const setClause = fields.map(field => `${field} = ?`).join(", ")
        const values = fields.map(field => data[field as keyof OwnerUpdateInput])

        const stmt = db.prepare(`
            UPDATE owners 
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `)

        const result = stmt.run(...values, numericId)

        if (result.changes === 0) {
            throw new NotFoundError("Owner not found")
        }

        return this.getById(id)
    }

    static delete(id: string): void {
        const numericId = Number(id)
        if (isNaN(numericId) || numericId <= 0) {
            throw new ValidationError("Invalid ID parameter")
        }

        const db = getDatabase()
        const result = db.prepare("DELETE FROM owners WHERE id = ?").run(numericId)

        if (result.changes === 0) {
            throw new NotFoundError("Owner not found")
        }
    }
}
