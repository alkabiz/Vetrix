import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, type Invoice } from "@/lib/database"
import { requireAnyRole } from "@/lib/middleware"
import { invoiceSchema, validateRequest } from "@/lib/validation"
import { handleApiError, logRequest } from "@/lib/error-handler"

export const GET = requireAnyRole(async (request: NextRequest) => {
  try {
    logRequest(request, "/api/invoices")

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
    return handleApiError(error)
  }
})

export const POST = requireAnyRole(async (request: NextRequest) => {
  try {
    logRequest(request, "/api/invoices")

    const validation = await validateRequest(invoiceSchema)(request)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const body = validation.data
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
    return handleApiError(error)
  }
})
