import { getDatabase } from "@/lib/database/database"
import { type MedicalRecordInput, type MedicalRecordUpdateInput } from "./validator"
import { MedicalRecordDTO, MedicalRecordEntity } from "@/lib/api/types/medical-record.types"
import { NotFoundError, ValidationError } from "@/lib/core/errors/api-errors"

export class MedicalRecordService {
    static getAll(petId?: string): MedicalRecordDTO[] {
        const db = getDatabase()
        let query = `
      SELECT mr.*, p.name as pet_name
      FROM medical_records mr
      JOIN pets p ON mr.pet_id = p.id
    `
        const params: any[] = []

        if (petId) {
            query += " WHERE mr.pet_id = ?"
            params.push(petId)
        }

        query += " ORDER BY mr.visit_date DESC"

        return db.prepare(query).all(...params) as MedicalRecordDTO[]
    }

    static getById(id: string): MedicalRecordDTO {
        const numericId = Number(id)
        if (isNaN(numericId) || numericId <= 0) {
            throw new ValidationError("Invalid ID parameter")
        }

        const db = getDatabase()
        const record = db
            .prepare(`
        SELECT mr.*, p.name as pet_name
        FROM medical_records mr
        JOIN pets p ON mr.pet_id = p.id
        WHERE mr.id = ?
      `)
            .get(numericId) as MedicalRecordDTO

        if (!record) {
            throw new NotFoundError("Medical record not found")
        }

        return record
    }

    static create(data: MedicalRecordInput): MedicalRecordDTO {
        const db = getDatabase()

        const stmt = db.prepare(`
      INSERT INTO medical_records (pet_id, appointment_id, visit_date, reason_for_visit, diagnosis, treatment, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

        const result = stmt.run(
            data.pet_id,
            data.appointment_id,
            data.visit_date,
            data.reason_for_visit,
            data.diagnosis,
            data.treatment,
            data.notes
        )

        return this.getById(result.lastInsertRowid.toString())
    }

    static update(id: string, data: MedicalRecordUpdateInput): MedicalRecordDTO {
        const numericId = Number(id)
        if (isNaN(numericId) || numericId <= 0) {
            throw new ValidationError("Invalid ID parameter")
        }

        const db = getDatabase()

        // Filter out undefined values
        const fields = Object.keys(data).filter(key => data[key as keyof MedicalRecordUpdateInput] !== undefined)
        if (fields.length === 0) {
            return this.getById(id)
        }

        const setClause = fields.map(field => `${field} = ?`).join(", ")
        const values = fields.map(field => data[field as keyof MedicalRecordUpdateInput])

        const stmt = db.prepare(`
            UPDATE medical_records 
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `)

        const result = stmt.run(...values, numericId)

        if (result.changes === 0) {
            throw new NotFoundError("Medical record not found")
        }

        return this.getById(id)
    }

    static delete(id: string): void {
        const numericId = Number(id)
        if (isNaN(numericId) || numericId <= 0) {
            throw new ValidationError("Invalid ID parameter")
        }

        const db = getDatabase()
        const result = db.prepare("DELETE FROM medical_records WHERE id = ?").run(numericId)

        if (result.changes === 0) {
            throw new NotFoundError("Medical record not found")
        }
    }
}
