import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, type Pet } from "@/lib/database"
import { requireAnyRole, requireVetOrAdmin } from "@/lib/middleware"
import { petSchema, validateRequest, validateIdParam } from "@/lib/validation"
import { handleApiError, logRequest, NotFoundError } from "@/lib/error-handler"

export const GET = requireAnyRole(async (request: NextRequest, context, { params }: { params: { id: string } }) => {
  try {
    logRequest(request, `/api/pets/${params.id}`)

    const idValidation = validateIdParam(params.id)
    if (!idValidation.success) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 })
    }

    const db = getDatabase()
    const pet = db
      .prepare(`
      SELECT p.*, o.name as owner_name 
      FROM pets p 
      JOIN owners o ON p.owner_id = o.id 
      WHERE p.id = ?
    `)
      .get(idValidation.id) as Pet

    if (!pet) {
      throw new NotFoundError("Pet not found")
    }

    return NextResponse.json(pet)
  } catch (error) {
    return handleApiError(error)
  }
})

export const PUT = requireVetOrAdmin(async (request: NextRequest, context, { params }: { params: { id: string } }) => {
  try {
    logRequest(request, `/api/pets/${params.id}`)

    const idValidation = validateIdParam(params.id)
    if (!idValidation.success) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 })
    }

    const validation = await validateRequest(petSchema.partial())(request)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const body = validation.data
    const db = getDatabase()

    const stmt = db.prepare(`
      UPDATE pets 
      SET owner_id = ?, name = ?, species = ?, breed = ?, sex = ?, age = ?, weight = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
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
      idValidation.id,
    )

    if (result.changes === 0) {
      throw new NotFoundError("Pet not found")
    }

    const updatedPet = db
      .prepare(`
      SELECT p.*, o.name as owner_name 
      FROM pets p 
      JOIN owners o ON p.owner_id = o.id 
      WHERE p.id = ?
    `)
      .get(idValidation.id) as Pet

    return NextResponse.json(updatedPet)
  } catch (error) {
    return handleApiError(error)
  }
})

export const DELETE = requireVetOrAdmin(
  async (request: NextRequest, context, { params }: { params: { id: string } }) => {
    try {
      logRequest(request, `/api/pets/${params.id}`)

      const idValidation = validateIdParam(params.id)
      if (!idValidation.success) {
        return NextResponse.json({ error: idValidation.error }, { status: 400 })
      }

      const db = getDatabase()
      const result = db.prepare("DELETE FROM pets WHERE id = ?").run(idValidation.id)

      if (result.changes === 0) {
        throw new NotFoundError("Pet not found")
      }

      return NextResponse.json({ message: "Pet deleted successfully" })
    } catch (error) {
      return handleApiError(error)
    }
  },
)
