import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { enableTwoFactor } from "@/lib/auth-enhanced"

export const POST = withAuth(async (request: NextRequest, { user }) => {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Verification code is required" }, { status: 400 })
    }

    const success = enableTwoFactor(user.id, code)

    if (!success) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    return NextResponse.json({
      message: "Two-factor authentication enabled successfully",
    })
  } catch (error) {
    console.error("2FA verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})