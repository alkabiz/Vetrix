import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, type Invoice } from "@/lib/database"

export async function GET() {
  try {
    const db = getDatabase()
    const invoices = db
      .prepare(`
      SELECT i.*, o.name as owner_name, p.name as pet_name
      FROM invoices i
      JOIN owners o ON i.owner_id = o.id
      JOIN pets p ON i.pet_id = p.id
      ORDER BY i.invoice_date DESC
    `)
      .all() as Invoice[]

    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Error al recuperar las facturas:", error)
    return NextResponse.json({ error: "No se pudieron recuperar las facturas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Omit<Invoice, "id" | "created_at" | "updated_at">
    const db = getDatabase()

    const stmt = db.prepare(`
      INSERT INTO invoices (owner_id, pet_id, appointment_id, invoice_date, services, total_amount, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      body.owner_id,
      body.pet_id,
      body.appointment_id,
      body.invoice_date,
      body.services,
      body.total_amount,
      body.status,
      body.notes,
    )

    const newInvoice = db
      .prepare(`
      SELECT i.*, o.name as owner_name, p.name as pet_name
      FROM invoices i
      JOIN owners o ON i.owner_id = o.id
      JOIN pets p ON i.pet_id = p.id
      WHERE i.id = ?
    `)
      .get(result.lastInsertRowid) as Invoice

    return NextResponse.json(newInvoice, { status: 201 })
  } catch (error) {
    console.error("Error al crear la factura:", error)
    return NextResponse.json({ error: "No se pudo crear la factura" }, { status: 500 })
  }
}
