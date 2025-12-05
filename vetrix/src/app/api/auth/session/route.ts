import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, findUserById } from "@/lib/auth/auth"
import { getAccessToken } from "@/lib/auth/cookie-utils"
import { getUserPermissions } from "@/lib/database/database-auth"

export async function GET(request: NextRequest) {
    try {
        // try to get token from cookie first (preferred for session)
        let token = getAccessToken(request)

        // fallback to header for backward compatibility/API usage
        if (!token) {
            const authHeader = request.headers.get("authorization")
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7)
            }
        }

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 })
        }

        const decoded = verifyToken(token)

        if (!decoded) {
            // Token exists but is invalid/expired - return null session
            return NextResponse.json({ user: null }, { status: 200 })
        }

        // Get fresh user data
        const user = await findUserById(decoded.id)
        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 })
        }

        // Get permissions
        const permissions = await getUserPermissions(user.id)

        // Remove sensitive data
        const { password_hash, ...userWithoutPassword } = user as any

        return NextResponse.json({
            user: userWithoutPassword,
            permissions
        })
    } catch (error) {
        console.error("Session check error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
