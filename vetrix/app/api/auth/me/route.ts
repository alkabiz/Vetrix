import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, findUserById } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    // Get fresh user data
    const user = await findUserById(decoded.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
