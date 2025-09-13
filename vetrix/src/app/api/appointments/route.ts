import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, type Appointment } from "@/lib/database"

export async function GET() {
  try {
    const db = getDatabase()
    const appointments = db
      .prepare(`
      SELECT a.*, p.name as pet_name, o.name as owner_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN owners o ON a.owner_id = o.id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `)
      .all() as Appointment[]

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Omit<Appointment, "id" | "created_at" | "updated_at">
    const db = getDatabase()

    const stmt = db.prepare(`
      INSERT INTO appointments (pet_id, owner_id, appointment_date, appointment_time, assigned_vet, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      body.pet_id,
      body.owner_id,
      body.appointment_date,
      body.appointment_time,
      body.assigned_vet,
      body.status,
      body.notes,
    )

    const newAppointment = db
      .prepare(`
      SELECT a.*, p.name as pet_name, o.name as owner_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN owners o ON a.owner_id = o.id
      WHERE a.id = ?
    `)
      .get(result.lastInsertRowid) as Appointment

    return NextResponse.json(newAppointment, { status: 201 })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}
