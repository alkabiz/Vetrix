import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { generateTwoFactorSecret } from "@/lib/auth-enhanced"

export const POST = withAuth(async (request: NextRequest, { user }) => {
  try {
    const { secret, qrCode } = generateTwoFactorSecret(user.id)

    return NextResponse.json({
      secret,
      qrCode,
      message: "Two-factor authentication setup initiated",
    })
  } catch (error) {
    console.error("2FA setup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})