import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, type Appointment } from "@/lib/database"
import { requireAnyRole } from "@/lib/middleware"
import { appointmentSchema, validateRequest } from "@/lib/validation"
import { handleApiError, logRequest } from "@/lib/error-handler"

export const GET = requireAnyRole(async (request: NextRequest) => {
  try {
    logRequest(request, "/api/appointments")

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
    return handleApiError(error)
  }
})

export const POST = requireAnyRole(async (request: NextRequest) => {
  try {
    logRequest(request, "/api/appointments")

    const validation = await validateRequest(appointmentSchema)(request)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const body = validation.data
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
    return handleApiError(error)
  }
})