import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, type Appointment } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDatabase()
    const appointment = db
      .prepare(`
      SELECT a.*, p.name as pet_name, o.name as owner_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN owners o ON a.owner_id = o.id
      WHERE a.id = ?
    `)
      .get(params.id) as Appointment

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = (await request.json()) as Partial<Appointment>
    const db = getDatabase()

    const stmt = db.prepare(`
      UPDATE appointments 
      SET pet_id = ?, owner_id = ?, appointment_date = ?, appointment_time = ?, assigned_vet = ?, status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    const result = stmt.run(
      body.pet_id,
      body.owner_id,
      body.appointment_date,
      body.appointment_time,
      body.assigned_vet,
      body.status,
      body.notes,
      params.id,
    )

    if (result.changes === 0) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    const updatedAppointment = db
      .prepare(`
      SELECT a.*, p.name as pet_name, o.name as owner_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN owners o ON a.owner_id = o.id
      WHERE a.id = ?
    `)
      .get(params.id) as Appointment

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDatabase()
    const result = db.prepare("DELETE FROM appointments WHERE id = ?").run(params.id)

    if (result.changes === 0) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    console.error("Error deleting appointment:", error)
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 })
  }
}
