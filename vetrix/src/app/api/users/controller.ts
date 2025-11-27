import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "./service"
import { handleApiError, logRequest } from "@/lib/core/error-handler"

export class UserController {
    static async getAll(request: NextRequest) {
        try {
            logRequest(request, "/api/users")
            const users = UserService.getAll()
            // Remove passwordHash from response
            const safeUsers = users.map(({ passwordHash, ...user }) => user)
            return NextResponse.json({ users: safeUsers })
        } catch (error) {
            return handleApiError(error)
        }
    }
}
