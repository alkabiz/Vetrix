import { NextResponse } from "next/server"
import { getDatabase, type MedicalRecord } from "@/lib/database"
import { requireAnyRole, requireVetOrAdmin, type AuthenticatedRequest } from "@/lib/middleware"

export const GET = requireAnyRole(async (request: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const petId = searchParams.get("pet_id")

    const db = getDatabase()
    let query = `
      SELECT mr.*, p.name as pet_name
      FROM medical_records mr
      JOIN pets p ON mr.pet_id = p.id
    `
    const params: any[] = []

    if (petId) {
      query += " WHERE mr.pet_id = ?"
      params.push(petId)
    }

    query += " ORDER BY mr.visit_date DESC"

    const records = db.prepare(query).all(...params) as MedicalRecord[]
    return NextResponse.json(records)
  } catch (error) {
    console.error("Error fetching medical records:", error)
    return NextResponse.json({ error: "Failed to fetch medical records" }, { status: 500 })
  }
})

export const POST = requireVetOrAdmin(async (request: AuthenticatedRequest) => {
  try {
    const body = (await request.json()) as Omit<MedicalRecord, "id" | "created_at" | "updated_at">
    const db = getDatabase()

    const stmt = db.prepare(`
      INSERT INTO medical_records (pet_id, appointment_id, visit_date, reason_for_visit, diagnosis, treatment, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      body.pet_id,
      body.appointment_id,
      body.visit_date,
      body.reason_for_visit,
      body.diagnosis,
      body.treatment,
      body.notes,
    )

    const newRecord = db
      .prepare(`
      SELECT mr.*, p.name as pet_name
      FROM medical_records mr
      JOIN pets p ON mr.pet_id = p.id
      WHERE mr.id = ?
    `)
      .get(result.lastInsertRowid) as MedicalRecord

    return NextResponse.json(newRecord, { status: 201 })
  } catch (error) {
    console.error("Error creating medical record:", error)
    return NextResponse.json({ error: "Failed to create medical record" }, { status: 500 })
  }
})
