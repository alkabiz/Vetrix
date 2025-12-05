import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "./service"
import { validateLogin, validateRegister } from "./validator"
import { handleApiError, logRequest } from "@/lib/core/error-handler"
import { setAuthCookies, clearAuthCookies, generateCSRFToken } from "@/lib/auth/cookie-utils"
import { createRefreshToken, generateRefreshToken, revokeAllUserTokens } from "@/lib/auth/refresh-token-service"
import { TOKEN_LIFETIMES } from "@/lib/api/types/auth.types"

export class AuthController {
    static async login(request: NextRequest) {
        try {
            logRequest(request, "/api/auth/login")
            const data = await validateLogin(request)
            const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
            const userAgent = request.headers.get("user-agent") || "unknown"

            const result = await AuthService.login(data, clientIP, userAgent)

            // Generate refresh token
            const refreshTokenValue = generateRefreshToken()
            const refreshExpiresAt = new Date(Date.now() + TOKEN_LIFETIMES.REFRESH_TOKEN * 1000)

            await createRefreshToken({
                userId: result.user.id,
                token: refreshTokenValue,
                expiresAt: refreshExpiresAt,
                deviceInfo: userAgent,
                ipAddress: clientIP,
            })

            // Generate CSRF token
            const csrfToken = generateCSRFToken()

            // Calculate access token expiration
            const accessExpiresAt = new Date(Date.now() + TOKEN_LIFETIMES.ACCESS_TOKEN * 1000)

            // Create response with HttpOnly cookies instead of returning tokens in JSON
            const response = NextResponse.json({
                message: result.message,
                user: result.user,
                permissions: result.permissions,
                expiresAt: accessExpiresAt.toISOString(),
            })

            // Set HttpOnly cookies
            setAuthCookies(response, result.token, refreshTokenValue, csrfToken)

            return response
        } catch (error) {
            return handleApiError(error)
        }
    }

    static async register(request: NextRequest) {
        try {
            logRequest(request, "/api/auth/register")
            const data = await validateRegister(request)
            const result = await AuthService.register(data)
            return NextResponse.json(result, { status: 201 })
        } catch (error) {
            return handleApiError(error)
        }
    }

    static async logout(request: NextRequest) {
        try {
            logRequest(request, "/api/auth/logout")

            // Optionally get user from token to revoke their refresh tokens
            // For now, we'll just clear cookies
            // In a full implementation, you'd:
            // 1. Get user ID from access token
            // 2. Revoke all refresh tokens for that user
            // await revokeAllUserTokens(userId)

            const response = NextResponse.json({
                message: "Logout successful"
            })

            // Clear all auth cookies
            clearAuthCookies(response)

            return response
        } catch (error) {
            return handleApiError(error)
        }
    }
}
