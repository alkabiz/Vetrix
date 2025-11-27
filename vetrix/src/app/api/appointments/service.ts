import { getDatabase, type Appointment } from "@/lib/database/database"
import { type AppointmentInput } from "./validator"

export class AppointmentService {
    static getAll(): Appointment[] {
        const db = getDatabase()
        return db
            .prepare(`
      SELECT a.*, p.name as pet_name, o.name as owner_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN owners o ON a.owner_id = o.id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `)
            .all() as Appointment[]
    }

    static create(data: AppointmentInput): Appointment {
        const db = getDatabase()

        const stmt = db.prepare(`
      INSERT INTO appointments (pet_id, owner_id, appointment_date, appointment_time, assigned_vet, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

        const result = stmt.run(
            data.pet_id,
            data.owner_id,
            data.appointment_date,
            data.appointment_time,
            data.assigned_vet,
            data.status,
            data.notes
        )

        return db
            .prepare(`
      SELECT a.*, p.name as pet_name, o.name as owner_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN owners o ON a.owner_id = o.id
      WHERE a.id = ?
    `)
            .get(result.lastInsertRowid) as Appointment
    }
}
