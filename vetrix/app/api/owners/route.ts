import { NextResponse } from "next/server"
import { getDatabase, type Owner } from "@/lib/database"
import { requireAnyRole, type AuthenticatedRequest } from "@/lib/middleware"

export const GET = requireAnyRole(async (request: AuthenticatedRequest) => {
  try {
    const db = getDatabase()
    const owners = db.prepare("SELECT * FROM owners ORDER BY name").all() as Owner[]
    return NextResponse.json(owners)
  } catch (error) {
    console.error("Error fetching owners:", error)
    return NextResponse.json({ error: "Failed to fetch owners" }, { status: 500 })
  }
})

export const POST = requireAnyRole(async (request: AuthenticatedRequest) => {
  try {
    const body = (await request.json()) as Omit<Owner, "id" | "created_at" | "updated_at">
    const db = getDatabase()

    const stmt = db.prepare(`
      INSERT INTO owners (name, phone, email, address)
      VALUES (?, ?, ?, ?)
    `)

    const result = stmt.run(body.name, body.phone, body.email, body.address)

    const newOwner = db.prepare("SELECT * FROM owners WHERE id = ?").get(result.lastInsertRowid) as Owner

    return NextResponse.json(newOwner, { status: 201 })
  } catch (error) {
    console.error("Error creating owner:", error)
    return NextResponse.json({ error: "Failed to create owner" }, { status: 500 })
  }
})
