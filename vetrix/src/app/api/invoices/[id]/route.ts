import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, type Invoice } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDatabase()
    const invoice = db
      .prepare(`
      SELECT i.*, o.name as owner_name, p.name as pet_name
      FROM invoices i
      JOIN owners o ON i.owner_id = o.id
      JOIN pets p ON i.pet_id = p.id
      WHERE i.id = ?
    `)
      .get(params.id) as Invoice

    if (!invoice) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error al obtener la factura:", error)
    return NextResponse.json({ error: "No se pudo recuperar la factura" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = (await request.json()) as Partial<Invoice>
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
      params.id,
    )

    if (result.changes === 0) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 })
    }

    const updatedInvoice = db
      .prepare(`
      SELECT i.*, o.name as owner_name, p.name as pet_name
      FROM invoices i
      JOIN owners o ON i.owner_id = o.id
      JOIN pets p ON i.pet_id = p.id
      WHERE i.id = ?
    `)
      .get(params.id) as Invoice

    return NextResponse.json(updatedInvoice)
  } catch (error) {
    console.error("Error al actualizar la factura:", error)
    return NextResponse.json({ error: "No se pudo actualizar la factura" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDatabase()
    const result = db.prepare("DELETE FROM invoices WHERE id = ?").run(params.id)

    if (result.changes === 0) {
      return NextResponse.json({ error: "Factura no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Factura eliminada correctamente" })
  } catch (error) {
    console.error("Error al eliminar la factura:", error)
    return NextResponse.json({ error: "No se pudo eliminar la factura" }, { status: 500 })
  }
}
