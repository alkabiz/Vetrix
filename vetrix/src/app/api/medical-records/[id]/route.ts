import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, type MedicalRecord } from "@/lib/database"
import { requireMedicalAccess, requireVetOrAdmin } from "@/lib/middleware"
import { medicalRecordSchema, validateRequest, validateIdParam } from "@/lib/validation"
import { handleApiError, logRequest, NotFoundError } from "@/lib/error-handler"

export const GET = requireMedicalAccess(
  async (request: NextRequest, context, { params }: { params: { id: string } }) => {
    try {
      logRequest(request, `/api/medical-records/${params.id}`)

      const idValidation = validateIdParam(params.id)
      if (!idValidation.success) {
        return NextResponse.json({ error: idValidation.error }, { status: 400 })
      }

      const db = getDatabase()
      const record = db
        .prepare(`
      SELECT mr.*, p.name as pet_name
      FROM medical_records mr
      JOIN pets p ON mr.pet_id = p.id
      WHERE mr.id = ?
    `)
        .get(idValidation.id) as MedicalRecord

      if (!record) {
        throw new NotFoundError("Medical record not found")
      }

      return NextResponse.json(record)
    } catch (error) {
      return handleApiError(error)
    }
  },
)

export const PUT = requireVetOrAdmin(async (request: NextRequest, context, { params }: { params: { id: string } }) => {
  try {
    logRequest(request, `/api/medical-records/${params.id}`)

    const idValidation = validateIdParam(params.id)
    if (!idValidation.success) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 })
    }

    const validation = await validateRequest(medicalRecordSchema.partial())(request)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const body = validation.data
    const db = getDatabase()

    const stmt = db.prepare(`
      UPDATE medical_records 
      SET pet_id = ?, appointment_id = ?, visit_date = ?, reason_for_visit = ?, diagnosis = ?, treatment = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    const result = stmt.run(
      body.pet_id,
      body.appointment_id,
      body.visit_date,
      body.reason_for_visit,
      body.diagnosis,
      body.treatment,
      body.notes,
      idValidation.id,
    )

    if (result.changes === 0) {
      throw new NotFoundError("Medical record not found")
    }

    const updatedRecord = db
      .prepare(`
      SELECT mr.*, p.name as pet_name
      FROM medical_records mr
      JOIN pets p ON mr.pet_id = p.id
      WHERE mr.id = ?
    `)
      .get(idValidation.id) as MedicalRecord

    return NextResponse.json(updatedRecord)
  } catch (error) {
    return handleApiError(error)
  }
})

export const DELETE = requireVetOrAdmin(
  async (request: NextRequest, context, { params }: { params: { id: string } }) => {
    try {
      logRequest(request, `/api/medical-records/${params.id}`)

      const idValidation = validateIdParam(params.id)
      if (!idValidation.success) {
        return NextResponse.json({ error: idValidation.error }, { status: 400 })
      }

      const db = getDatabase()
      const result = db.prepare("DELETE FROM medical_records WHERE id = ?").run(idValidation.id)

      if (result.changes === 0) {
        throw new NotFoundError("Medical record not found")
      }

      return NextResponse.json({ message: "Medical record deleted successfully" })
    } catch (error) {
      return handleApiError(error)
    }
  },
)
