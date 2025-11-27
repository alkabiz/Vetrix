import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "./service"
import { validateLogin, validateRegister } from "./validator"
import { handleApiError, logRequest } from "@/lib/core/error-handler"

export class AuthController {
    static async login(request: NextRequest) {
        try {
            logRequest(request, "/api/auth/login")
            const data = await validateLogin(request)
            const clientIP = request.ip || request.headers.get("x-forwarded-for") || "unknown"
            const userAgent = request.headers.get("user-agent") || "unknown"

            const result = await AuthService.login(data, clientIP, userAgent)
            return NextResponse.json(result)
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
}
