import { NextResponse } from "next/server"
import { getDatabase, type Owner } from "@/lib/database"
import { requireAnyRole, requireVetOrAdmin, type AuthenticatedRequest } from "@/lib/middleware"

export const GET = requireAnyRole(async (request: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  try {
    const db = getDatabase()
    const owner = db.prepare("SELECT * FROM owners WHERE id = ?").get(params.id) as Owner

    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 })
    }

    return NextResponse.json(owner)
  } catch (error) {
    console.error("Error fetching owner:", error)
    return NextResponse.json({ error: "Failed to fetch owner" }, { status: 500 })
  }
})

export const PUT = requireAnyRole(async (request: AuthenticatedRequest, { params }: { params: { id: string } }) => {
  try {
    const body = (await request.json()) as Partial<Owner>
    const db = getDatabase()

    const stmt = db.prepare(`
      UPDATE owners 
      SET name = ?, phone = ?, email = ?, address = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    const result = stmt.run(body.name, body.phone, body.email, body.address, params.id)

    if (result.changes === 0) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 })
    }

    const updatedOwner = db.prepare("SELECT * FROM owners WHERE id = ?").get(params.id) as Owner
    return NextResponse.json(updatedOwner)
  } catch (error) {
    console.error("Error updating owner:", error)
    return NextResponse.json({ error: "Failed to update owner" }, { status: 500 })
  }
})

export const DELETE = requireVetOrAdmin(
  async (request: AuthenticatedRequest, { params }: { params: { id: string } }) => {
    try {
      const db = getDatabase()
      const result = db.prepare("DELETE FROM owners WHERE id = ?").run(params.id)

      if (result.changes === 0) {
        return NextResponse.json({ error: "Owner not found" }, { status: 404 })
      }

      return NextResponse.json({ message: "Owner deleted successfully" })
    } catch (error) {
      console.error("Error deleting owner:", error)
      return NextResponse.json({ error: "Failed to delete owner" }, { status: 500 })
    }
  },
)
