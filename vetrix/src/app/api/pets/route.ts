import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, type Pet } from "@/lib/database"
import { requireAnyRole } from "@/lib/middleware"
import { petSchema, validateRequest } from "@/lib/validation"
import { handleApiError, logRequest } from "@/lib/error-handler"

export const GET = requireAnyRole(async (request: NextRequest) => {
  try {
    logRequest(request, "/api/pets")

    const db = getDatabase()
    const pets = db
      .prepare(`
      SELECT p.*, o.name as owner_name 
      FROM pets p 
      JOIN owners o ON p.owner_id = o.id 
      ORDER BY p.name
    `)
      .all() as Pet[]

    return NextResponse.json(pets)
  } catch (error) {
    return handleApiError(error)
  }
})

export const POST = requireAnyRole(async (request: NextRequest) => {
  try {
    logRequest(request, "/api/pets")

    const validation = await validateRequest(petSchema)(request)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const body = validation.data
    const db = getDatabase()

    const stmt = db.prepare(`
      INSERT INTO pets (owner_id, name, species, breed, sex, age, weight, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      body.owner_id,
      body.name,
      body.species,
      body.breed,
      body.sex,
      body.age,
      body.weight,
      body.notes,
    )

    const newPet = db
      .prepare(`
      SELECT p.*, o.name as owner_name 
      FROM pets p 
      JOIN owners o ON p.owner_id = o.id 
      WHERE p.id = ?
    `)
      .get(result.lastInsertRowid) as Pet

    return NextResponse.json(newPet, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
})
