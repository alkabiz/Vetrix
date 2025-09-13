import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, type Pet } from "@/lib/database"

export async function GET() {
  try {
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
    console.error("Error al obtener mascotas:", error)
    return NextResponse.json({ error: "No se pudieron recuperar las mascotas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Omit<Pet, "id" | "created_at" | "updated_at">
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
    console.error("Error al crear mascota:", error)
    return NextResponse.json({ error: "No se pudo crear la mascota" }, { status: 500 })
  }
}
