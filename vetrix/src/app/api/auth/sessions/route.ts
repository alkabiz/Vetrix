import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/config/middleware"
import { getUserSessions } from "@/lib/auth/auth-enhanced"

export const GET = withAuth(async (request: NextRequest, { user }) => {
  try {
    const sessions = await getUserSessions(user.id)

    // Add current session indicator
    const currentSessionId = request.headers.get("x-session-id")
    const sessionsWithCurrent = sessions.map((session: any) => ({
      ...session,
      isCurrent: session.id === currentSessionId,
    }))

    return NextResponse.json({ sessions: sessionsWithCurrent })
  } catch (error) {
    console.error("Sessions fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})