import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, type MedicalRecord } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDatabase()
    const record = db
      .prepare(`
      SELECT mr.*, p.name as pet_name
      FROM medical_records mr
      JOIN pets p ON mr.pet_id = p.id
      WHERE mr.id = ?
    `)
      .get(params.id) as MedicalRecord

    if (!record) {
      return NextResponse.json({ error: "Medical record not found" }, { status: 404 })
    }

    return NextResponse.json(record)
  } catch (error) {
    console.error("Error fetching medical record:", error)
    return NextResponse.json({ error: "Failed to fetch medical record" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = (await request.json()) as Partial<MedicalRecord>
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
      params.id,
    )

    if (result.changes === 0) {
      return NextResponse.json({ error: "Medical record not found" }, { status: 404 })
    }

    const updatedRecord = db
      .prepare(`
      SELECT mr.*, p.name as pet_name
      FROM medical_records mr
      JOIN pets p ON mr.pet_id = p.id
      WHERE mr.id = ?
    `)
      .get(params.id) as MedicalRecord

    return NextResponse.json(updatedRecord)
  } catch (error) {
    console.error("Error updating medical record:", error)
    return NextResponse.json({ error: "Failed to update medical record" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDatabase()
    const result = db.prepare("DELETE FROM medical_records WHERE id = ?").run(params.id)

    if (result.changes === 0) {
      return NextResponse.json({ error: "Medical record not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Medical record deleted successfully" })
  } catch (error) {
    console.error("Error deleting medical record:", error)
    return NextResponse.json({ error: "Failed to delete medical record" }, { status: 500 })
  }
}
