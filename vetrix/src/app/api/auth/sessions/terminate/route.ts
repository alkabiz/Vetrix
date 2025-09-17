import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { logout } from "@/lib/auth-enhanced"

export const POST = withAuth(async (request: NextRequest, { user }) => {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    logout(sessionId)

    return NextResponse.json({
      message: "Session terminated successfully",
    })
  } catch (error) {
    console.error("Session termination error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
