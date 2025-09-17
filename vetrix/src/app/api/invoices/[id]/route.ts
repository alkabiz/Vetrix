import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, type Invoice } from "@/lib/database"
import { requireAnyRole, requireVetOrAdmin } from "@/lib/middleware"
import { invoiceSchema, validateRequest, validateIdParam } from "@/lib/validation"
import { handleApiError, logRequest, NotFoundError } from "@/lib/error-handler"

export const GET = requireAnyRole(async (request: NextRequest, context, { params }: { params: { id: string } }) => {
  try {
    logRequest(request, `/api/invoices/${params.id}`)

    const idValidation = validateIdParam(params.id)
    if (!idValidation.success) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 })
    }

    const db = getDatabase()
    const invoice = db
      .prepare(`
      SELECT i.*, o.name as owner_name, p.name as pet_name
      FROM invoices i
      JOIN owners o ON i.owner_id = o.id
      JOIN pets p ON i.pet_id = p.id
      WHERE i.id = ?
    `)
      .get(idValidation.id) as Invoice

    if (!invoice) {
      throw new NotFoundError("Invoice not found")
    }

    return NextResponse.json(invoice)
  } catch (error) {
    return handleApiError(error)
  }
})

export const PUT = requireVetOrAdmin(async (request: NextRequest, context, { params }: { params: { id: string } }) => {
  try {
    logRequest(request, `/api/invoices/${params.id}`)

    const idValidation = validateIdParam(params.id)
    if (!idValidation.success) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 })
    }

    const validation = await validateRequest(invoiceSchema.partial())(request)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const body = validation.data
    const db = getDatabase()

    const stmt = db.prepare(`
      UPDATE invoices 
      SET owner_id = ?, pet_id = ?, appointment_id = ?, invoice_date = ?, services = ?, total_amount = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
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
      idValidation.id,
    )

    if (result.changes === 0) {
      throw new NotFoundError("Invoice not found")
    }

    const updatedInvoice = db
      .prepare(`
      SELECT i.*, o.name as owner_name, p.name as pet_name
      FROM invoices i
      JOIN owners o ON i.owner_id = o.id
      JOIN pets p ON i.pet_id = p.id
      WHERE i.id = ?
    `)
      .get(idValidation.id) as Invoice

    return NextResponse.json(updatedInvoice)
  } catch (error) {
    return handleApiError(error)
  }
})

export const DELETE = requireVetOrAdmin(
  async (request: NextRequest, context, { params }: { params: { id: string } }) => {
    try {
      logRequest(request, `/api/invoices/${params.id}`)

      const idValidation = validateIdParam(params.id)
      if (!idValidation.success) {
        return NextResponse.json({ error: idValidation.error }, { status: 400 })
      }

      const db = getDatabase()
      const result = db.prepare("DELETE FROM invoices WHERE id = ?").run(idValidation.id)

      if (result.changes === 0) {
        throw new NotFoundError("Invoice not found")
      }

      return NextResponse.json({ message: "Invoice deleted successfully" })
    } catch (error) {
      return handleApiError(error)
    }
  },
)
