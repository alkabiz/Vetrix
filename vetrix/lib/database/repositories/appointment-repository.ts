import { getDatabase } from "@/lib/database/database"
import { AppointmentEntity, CreateAppointmentDTO, UpdateAppointmentDTO } from "@/lib/api/types/appointment.types"

export class AppointmentRepository {
    static findById(id: number): AppointmentEntity | undefined {
        const db = getDatabase()
        return db
            .prepare(`
      SELECT * FROM appointments WHERE id = ?
    `)
            .get(id) as AppointmentEntity | undefined
    }

    static findByIdWithDetails(id: number): any {
        const db = getDatabase()
        return db
            .prepare(`
      SELECT a.*, 
             p.name as pet_name, 
             o.name as owner_name,
             v.name as veterinarian_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN owners o ON a.owner_id = o.id
      LEFT JOIN veterinarians v ON a.veterinarian_id = v.id
      WHERE a.id = ?
    `)
            .get(id)
    }

    static create(data: CreateAppointmentDTO): AppointmentEntity {
        const db = getDatabase()
        const stmt = db.prepare(`
      INSERT INTO appointments (pet_id, owner_id, appointment_date, appointment_time, reason, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
        const result = stmt.run(
            data.pet_id,
            data.owner_id,
            data.appointment_date,
            data.appointment_time,
            data.reason,
            data.status,
            data.notes
        )
        return this.findById(result.lastInsertRowid as number)!
    }

    static update(id: number, data: UpdateAppointmentDTO): AppointmentEntity | undefined {
        const db = getDatabase()

        // Build dynamic update query
        const fields: string[] = []
        const values: any[] = []

        if (data.pet_id !== undefined) { fields.push("pet_id = ?"); values.push(data.pet_id) }
        if (data.owner_id !== undefined) { fields.push("owner_id = ?"); values.push(data.owner_id) }
        if (data.appointment_date !== undefined) { fields.push("appointment_date = ?"); values.push(data.appointment_date) }
        if (data.appointment_time !== undefined) { fields.push("appointment_time = ?"); values.push(data.appointment_time) }
        if (data.reason !== undefined) { fields.push("reason = ?"); values.push(data.reason) }
        if (data.status !== undefined) { fields.push("status = ?"); values.push(data.status) }
        if (data.notes !== undefined) { fields.push("notes = ?"); values.push(data.notes) }

        fields.push("updated_at = CURRENT_TIMESTAMP")
        values.push(id)

        if (fields.length === 1) return this.findById(id) // No fields to update

        const stmt = db.prepare(`UPDATE appointments SET ${fields.join(", ")} WHERE id = ?`)
        const result = stmt.run(...values)

        if (result.changes === 0) return undefined
        return this.findById(id)
    }

    static delete(id: number): boolean {
        const db = getDatabase()
        const result = db.prepare("DELETE FROM appointments WHERE id = ?").run(id)
        return result.changes > 0
    }
}
