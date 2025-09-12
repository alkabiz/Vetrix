import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, type Pet } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDatabase()
    const pet = db
      .prepare(`
      SELECT p.*, o.name as owner_name 
      FROM pets p 
      JOIN owners o ON p.owner_id = o.id 
      WHERE p.id = ?
    `)
      .get(params.id) as Pet

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    return NextResponse.json(pet)
  } catch (error) {
    console.error("Error fetching pet:", error)
    return NextResponse.json({ error: "Failed to fetch pet" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = (await request.json()) as Partial<Pet>
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
      params.id,
    )

    if (result.changes === 0) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    const updatedPet = db
      .prepare(`
      SELECT p.*, o.name as owner_name 
      FROM pets p 
      JOIN owners o ON p.owner_id = o.id 
      WHERE p.id = ?
    `)
      .get(params.id) as Pet

    return NextResponse.json(updatedPet)
  } catch (error) {
    console.error("Error updating pet:", error)
    return NextResponse.json({ error: "Failed to update pet" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDatabase()
    const result = db.prepare("DELETE FROM pets WHERE id = ?").run(params.id)

    if (result.changes === 0) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Pet deleted successfully" })
  } catch (error) {
    console.error("Error deleting pet:", error)
    return NextResponse.json({ error: "Failed to delete pet" }, { status: 500 })
  }
}
