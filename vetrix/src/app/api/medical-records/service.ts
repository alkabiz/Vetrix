import { getDatabase, type MedicalRecord } from "@/lib/database/database"
import { type MedicalRecordInput } from "./validator"

export class MedicalRecordService {
    static getAll(petId?: string): MedicalRecord[] {
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

        return db.prepare(query).all(...params) as MedicalRecord[]
    }

    static create(data: MedicalRecordInput): MedicalRecord {
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

        return db
            .prepare(`
      SELECT mr.*, p.name as pet_name
      FROM medical_records mr
      JOIN pets p ON mr.pet_id = p.id
      WHERE mr.id = ?
    `)
            .get(result.lastInsertRowid) as MedicalRecord
    }
}
