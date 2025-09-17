import { type NextRequest, NextResponse } from "next/server"
import { logout, blacklistToken } from "@/lib/auth-enhanced"

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()
    const authHeader = request.headers.get("authorization")

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      blacklistToken(token)
    }

    if (sessionId) {
      logout(sessionId)
    }

    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}