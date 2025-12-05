import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"

// Force Node.js runtime for JWT operations
export const runtime = "nodejs"

interface TokenPayload {
    id: number
    email: string
    role: string
    roleId: number
    username: string
}

/**
 * POST /api/auth/verify
 * Verifies a JWT token and returns user payload
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { token } = body

        if (!token) {
            return Response.json(
                { valid: false, error: "No token provided" },
                { status: 400 }
            )
        }

        // Verify token using JWT_SECRET
        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
            console.error("JWT_SECRET is not defined in environment variables")
            return Response.json(
                { valid: false, error: "Server configuration error" },
                { status: 500 }
            )
        }

        const payload = jwt.verify(token, jwtSecret) as TokenPayload

        return Response.json({
            valid: true,
            user: {
                id: payload.id,
                email: payload.email,
                role: payload.role,
                roleId: payload.roleId,
                username: payload.username,
            },
        })
    } catch (error) {
        // Token verification failed
        if (error instanceof jwt.JsonWebTokenError) {
            return Response.json(
                { valid: false, error: "Invalid token" },
                { status: 401 }
            )
        }

        if (error instanceof jwt.TokenExpiredError) {
            return Response.json(
                { valid: false, error: "Token expired" },
                { status: 401 }
            )
        }

        console.error("Token verification error:", error)
        return Response.json(
            { valid: false, error: "Token verification failed" },
            { status: 401 }
        )
    }
}
