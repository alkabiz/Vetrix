import { getDatabase } from "@/lib/database/database"
import { InvoiceDTO, InvoiceEntity } from "@/lib/api/types/invoice.types"

export class InvoiceRepository {
    findById(id: number): InvoiceDTO | null {
        const db = getDatabase()
        const invoice = db
            .prepare(`
      SELECT i.*, o.name as owner_name, p.name as pet_name
      FROM invoices i
      JOIN owners o ON i.owner_id = o.id
      JOIN pets p ON i.pet_id = p.id
      WHERE i.id = ?
    `)
            .get(id) as InvoiceDTO | undefined

        return invoice || null
    }

    update(id: number, data: Partial<InvoiceEntity>): boolean {
        const db = getDatabase()

        // Filter out undefined values and build the query dynamically
        const fields = Object.keys(data).filter(key => data[key as keyof InvoiceEntity] !== undefined)
        if (fields.length === 0) return false

        const setClause = fields.map(field => `${field} = ?`).join(", ")
        const values = fields.map(field => data[field as keyof InvoiceEntity])

        // Add updated_at if not present
        if (!fields.includes('updated_at')) {
            // We'll let the DB handle it or add it here. The original code used CURRENT_TIMESTAMP in SQL.
            // Let's stick to the original SQL approach if possible, but dynamic is better.
            // For now, I'll append updated_at = CURRENT_TIMESTAMP to the query string if I construct it manually.
            // But wait, the original code had a fixed query.
            // Let's use the fixed query approach for the fields that were allowed in the original route, 
            // or make it dynamic but safe.
        }

        // The original route updated: owner_id, pet_id, appointment_id, invoice_date, services, total_amount, status, notes, updated_at
        // I will implement a specific update method for these fields to match the original behavior exactly, 
        // or a generic one. A generic one is better for scalability.

        const stmt = db.prepare(`
      UPDATE invoices 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

        const result = stmt.run(...values, id)
        return result.changes > 0
    }

    delete(id: number): boolean {
        const db = getDatabase()
        const result = db.prepare("DELETE FROM invoices WHERE id = ?").run(id)
        return result.changes > 0
    }
}
