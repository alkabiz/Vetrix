import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, type Appointment } from "@/lib/database"
import { requireAnyRole, requireVetOrAdmin } from "@/lib/middleware"
import { appointmentSchema, validateRequest, validateIdParam } from "@/lib/validation"
import { handleApiError, logRequest, NotFoundError } from "@/lib/error-handler"

export const GET = requireAnyRole(async (request: NextRequest, context, { params }: { params: { id: string } }) => {
  try {
    logRequest(request, `/api/appointments/${params.id}`)

    const idValidation = validateIdParam(params.id)
    if (!idValidation.success) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 })
    }

    const db = getDatabase()
    const appointment = db
      .prepare(`
      SELECT a.*, p.name as pet_name, o.name as owner_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN owners o ON a.owner_id = o.id
      WHERE a.id = ?
    `)
      .get(idValidation.id) as Appointment

    if (!appointment) {
      throw new NotFoundError("Appointment not found")
    }

    return NextResponse.json(appointment)
  } catch (error) {
    return handleApiError(error)
  }
})

export const PUT = requireVetOrAdmin(async (request: NextRequest, context, { params }: { params: { id: string } }) => {
  try {
    logRequest(request, `/api/appointments/${params.id}`)

    const idValidation = validateIdParam(params.id)
    if (!idValidation.success) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 })
    }

    const validation = await validateRequest(appointmentSchema.partial())(request)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const body = validation.data
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
      idValidation.id,
    )

    if (result.changes === 0) {
      throw new NotFoundError("Appointment not found")
    }

    const updatedAppointment = db
      .prepare(`
      SELECT a.*, p.name as pet_name, o.name as owner_name
      FROM appointments a
      JOIN pets p ON a.pet_id = p.id
      JOIN owners o ON a.owner_id = o.id
      WHERE a.id = ?
    `)
      .get(idValidation.id) as Appointment

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    return handleApiError(error)
  }
})

export const DELETE = requireVetOrAdmin(
  async (request: NextRequest, context, { params }: { params: { id: string } }) => {
    try {
      logRequest(request, `/api/appointments/${params.id}`)

      const idValidation = validateIdParam(params.id)
      if (!idValidation.success) {
        return NextResponse.json({ error: idValidation.error }, { status: 400 })
      }

      const db = getDatabase()
      const result = db.prepare("DELETE FROM appointments WHERE id = ?").run(idValidation.id)

      if (result.changes === 0) {
        throw new NotFoundError("Appointment not found")
      }

      return NextResponse.json({ message: "Appointment deleted successfully" })
    } catch (error) {
      return handleApiError(error)
    }
  },
)