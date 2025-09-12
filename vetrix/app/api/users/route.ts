import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers, verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Only admin can view all users
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Access denied. Admin role required" }, { status: 403 })
    }

    const users = await getAllUsers()
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
