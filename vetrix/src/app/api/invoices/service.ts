import { getDatabase, type Invoice } from "@/lib/database/database"
import { type InvoiceInput } from "./validator"

export class InvoiceService {
    static getAll(): Invoice[] {
        const db = getDatabase()
        return db
            .prepare(`
      SELECT i.*, o.name as owner_name, p.name as pet_name
      FROM invoices i
      JOIN owners o ON i.owner_id = o.id
      JOIN pets p ON i.pet_id = p.id
      ORDER BY i.invoice_date DESC
    `)
            .all() as Invoice[]
    }

    static create(data: InvoiceInput): Invoice {
        const db = getDatabase()

        const stmt = db.prepare(`
      INSERT INTO invoices (owner_id, pet_id, appointment_id, invoice_date, services, total_amount, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

        const result = stmt.run(
            data.owner_id,
            data.pet_id,
            data.appointment_id,
            data.invoice_date,
            data.services,
            data.total_amount,
            data.status,
            data.notes
        )

        return db
            .prepare(`
      SELECT i.*, o.name as owner_name, p.name as pet_name
      FROM invoices i
      JOIN owners o ON i.owner_id = o.id
      JOIN pets p ON i.pet_id = p.id
      WHERE i.id = ?
    `)
            .get(result.lastInsertRowid) as Invoice
    }
}
