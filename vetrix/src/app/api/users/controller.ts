import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "./service"
import { handleApiError, logRequest } from "@/lib/core/error-handler"
import { verifyAccessToken } from "@/lib/auth/token-service"

export class UserController {
    // ============================================================================
    // Query Handlers
    // ============================================================================

    /**
     * GET /api/users - Get all users with optional pagination
     */
    static async getAll(request: NextRequest) {
        try {
            logRequest(request, "/api/users")

            // Get query parameters
            const { searchParams } = new URL(request.url)
            const page = parseInt(searchParams.get("page") || "1")
            const limit = parseInt(searchParams.get("limit") || "20")
            const search = searchParams.get("search") || undefined
            const roleId = searchParams.get("roleId") ? parseInt(searchParams.get("roleId")!) : undefined
            const statusId = searchParams.get("statusId") ? parseInt(searchParams.get("statusId")!) : undefined

            // Check if pagination is requested
            const isPaginated = searchParams.has("page") || searchParams.has("limit")

            if (isPaginated) {
                // Return paginated response
                const result = UserService.getAllPaginated(page, limit, search, roleId, statusId)

                // Remove passwordHash from all users
                const safeData = result.data.map(({ passwordHash, currentSessionId, ...user }) => user)

                return NextResponse.json({
                    ...result,
                    data: safeData,
                })
            } else {
                // Return all users (legacy support)
                const users = UserService.getAll()
                const safeUsers = users.map(({ passwordHash, currentSessionId, ...user }) => user)
                return NextResponse.json({ users: safeUsers })
            }
        } catch (error) {
            return handleApiError(error)
        }
    }

    /**
     * GET /api/users/:id - Get user by ID
     */
    static async getById(request: NextRequest, { params }: { params: { id: string } }) {
        try {
            logRequest(request, `/api/users/${params.id}`)

            const user = UserService.getById(parseInt(params.id))

            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 })
            }

            // Remove sensitive fields
            const { passwordHash, currentSessionId, ...safeUser } = user

            return NextResponse.json({ user: safeUser })
        } catch (error) {
            return handleApiError(error)
        }
    }

    // ============================================================================
    // Mutation Handlers
    // ============================================================================

    /**
     * PUT /api/users/:id - Update user
     */
    static async update(request: NextRequest, { params }: { params: { id: string } }) {
        try {
            logRequest(request, `/api/users/${params.id}`)

            // Get current user from token
            const token = request.headers.get("authorization")?.split(" ")[1]
            if (!token) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            }

            const decoded = verifyAccessToken(token)
            if (!decoded) {
                return NextResponse.json({ error: "Invalid token" }, { status: 401 })
            }
            const currentUserId = decoded.id

            const userId = parseInt(params.id)
            const body = await request.json()

            // Validate that user exists
            const existingUser = UserService.getById(userId)
            if (!existingUser) {
                return NextResponse.json({ error: "User not found" }, { status: 404 })
            }

            // Check if trying to change role of last admin
            if (body.roleId && body.roleId !== 1 && existingUser.roleId === 1) {
                const allUsers = UserService.getAll()
                const adminCount = allUsers.filter(u => u.roleId === 1).length

                if (adminCount <= 1) {
                    return NextResponse.json(
                        { error: "Cannot change role of last admin user" },
                        { status: 400 }
                    )
                }
            }

            // Update user
            const updatedUser = UserService.update(userId, body)

            // Create audit log
            const details = JSON.stringify({
                changes: body,
                previousRole: existingUser.roleId,
                newRole: updatedUser.roleId,
            })
            UserService.createAuditLog("user_updated", currentUserId, userId, details)

            // Remove sensitive fields
            const { passwordHash, currentSessionId, ...safeUser } = updatedUser

            return NextResponse.json({ user: safeUser })
        } catch (error) {
            return handleApiError(error)
        }
    }

    /**
     * DELETE /api/users/:id - Delete user
     */
    static async delete(request: NextRequest, { params }: { params: { id: string } }) {
        try {
            logRequest(request, `/api/users/${params.id}`)

            // Get current user from token
            const token = request.headers.get("authorization")?.split(" ")[1]
            if (!token) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            }

            const decoded = verifyAccessToken(token)
            if (!decoded) {
                return NextResponse.json({ error: "Invalid token" }, { status: 401 })
            }
            const currentUserId = decoded.id

            const userId = parseInt(params.id)

            // Validate that user exists
            const existingUser = UserService.getById(userId)
            if (!existingUser) {
                return NextResponse.json({ error: "User not found" }, { status: 404 })
            }

            // Prevent deleting last admin
            if (existingUser.roleId === 1) {
                const allUsers = UserService.getAll()
                const adminCount = allUsers.filter(u => u.roleId === 1).length

                if (adminCount <= 1) {
                    return NextResponse.json(
                        { error: "Cannot delete the last admin user" },
                        { status: 400 }
                    )
                }
            }

            // Delete user
            UserService.delete(userId)

            // Create audit log
            const details = JSON.stringify({
                username: existingUser.username,
                email: existingUser.email,
                roleId: existingUser.roleId,
            })
            UserService.createAuditLog("user_deleted", currentUserId, userId, details)

            return NextResponse.json({ success: true })
        } catch (error) {
            return handleApiError(error)
        }
    }

    // ============================================================================
    // Bulk Operation Handlers
    // ============================================================================

    /**
     * POST /api/users/bulk/delete - Bulk delete users
     */
    static async bulkDelete(request: NextRequest) {
        try {
            logRequest(request, "/api/users/bulk/delete")

            // Get current user from token
            const token = request.headers.get("authorization")?.split(" ")[1]
            if (!token) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            }

            const decoded = verifyAccessToken(token)
            if (!decoded) {
                return NextResponse.json({ error: "Invalid token" }, { status: 401 })
            }
            const currentUserId = decoded.id

            const { userIds } = await request.json()

            if (!Array.isArray(userIds) || userIds.length === 0) {
                return NextResponse.json({ error: "Invalid userIds array" }, { status: 400 })
            }

            // Check if any of the users are admins
            const allUsers = UserService.getAll()
            const adminCount = allUsers.filter(u => u.roleId === 1).length
            const adminsToDelete = userIds.filter(id => {
                const user = allUsers.find(u => u.id === id)
                return user && user.roleId === 1
            })

            if (adminsToDelete.length > 0 && adminsToDelete.length >= adminCount) {
                return NextResponse.json(
                    { error: "Cannot delete all admin users" },
                    { status: 400 }
                )
            }

            // Bulk delete
            UserService.bulkDelete(userIds)

            // Create audit log
            const details = JSON.stringify({ userIds, count: userIds.length })
            UserService.createAuditLog("bulk_delete", currentUserId, undefined, details)

            return NextResponse.json({ success: true, deletedCount: userIds.length })
        } catch (error) {
            return handleApiError(error)
        }
    }

    /**
     * POST /api/users/bulk/role - Bulk change user role
     */
    static async bulkRoleChange(request: NextRequest) {
        try {
            logRequest(request, "/api/users/bulk/role")

            // Get current user from token
            const token = request.headers.get("authorization")?.split(" ")[1]
            if (!token) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
            }

            const decoded = verifyAccessToken(token)
            if (!decoded) {
                return NextResponse.json({ error: "Invalid token" }, { status: 401 })
            }
            const currentUserId = decoded.id

            const { userIds, roleId } = await request.json()

            if (!Array.isArray(userIds) || userIds.length === 0) {
                return NextResponse.json({ error: "Invalid userIds array" }, { status: 400 })
            }

            if (!roleId) {
                return NextResponse.json({ error: "roleId is required" }, { status: 400 })
            }

            // Check if changing admins to non-admin would leave no admins
            if (roleId !== 1) {
                const allUsers = UserService.getAll()
                const totalAdmins = allUsers.filter(u => u.roleId === 1).length
                const affectedAdmins = userIds.filter(id => {
                    const user = allUsers.find(u => u.id === id)
                    return user && user.roleId === 1
                })

                if (affectedAdmins.length > 0 && affectedAdmins.length >= totalAdmins) {
                    return NextResponse.json(
                        { error: "Cannot change all admin users to a different role" },
                        { status: 400 }
                    )
                }
            }

            // Bulk update role
            UserService.bulkUpdateRole(userIds, roleId)

            // Create audit log
            const details = JSON.stringify({ userIds, roleId, count: userIds.length })
            UserService.createAuditLog("bulk_role_change", currentUserId, undefined, details)

            return NextResponse.json({ success: true, updatedCount: userIds.length })
        } catch (error) {
            return handleApiError(error)
        }
    }

    // ============================================================================
    // Audit Log Handlers
    // ============================================================================

    /**
     * GET /api/users/audit - Get audit logs
     */
    static async getAuditLogs(request: NextRequest) {
        try {
            logRequest(request, "/api/users/audit")

            const { searchParams } = new URL(request.url)
            const userId = searchParams.get("userId") ? parseInt(searchParams.get("userId")!) : undefined
            const limit = parseInt(searchParams.get("limit") || "100")

            const logs = UserService.getAuditLogs(userId, limit)

            return NextResponse.json({ logs })
        } catch (error) {
            return handleApiError(error)
        }
    }


    /**
     * POST /api/users/audit - Create audit log entry
     * Publicly accessible for login events, but restricted for others
     */
    static async createLog(request: NextRequest) {
        try {
            // We do NOT use logRequest here to avoid infinite loops if logRequest uses this endpoint (it doesn't, it uses console/internal)
            
            const body = await request.json()
            const { action, status, reason, login } = body

            if (!action) {
                return NextResponse.json({ error: "Action is required" }, { status: 400 })
            }

            // Publicly allowed actions
            if (action === "login" || action === "login_failed") {
                // For login actions, we try to resolve the user
                // If we have a 'login' field (email/username), try to find the user
                let userId: number | undefined = undefined

                if (login) {
                    // Try to find user by email or username
                    const allUsers = UserService.getAll()
                    const user = allUsers.find(u => u.email === login || u.username === login)
                    if (user) {
                        userId = user.id
                    }
                }

                if (action === "login" && !userId) {
                    // If success but no user found? Should not happen for success.
                    // But if it was passed via performedBy?
                    // The client might send the user object if known.
                    if (body.performedBy) userId = body.performedBy
                }

                if (userId) {
                     const details = reason ? JSON.stringify({ reason, status }) : JSON.stringify({ status })
                     UserService.createAuditLog(action, userId, userId, details)
                     return NextResponse.json({ success: true })
                } else {
                    // Cannot log to DB if user not found (FK constraint)
                    console.warn(`[Audit] Could not log ${action} for ${login}: User not found`)
                    return NextResponse.json({ success: true, message: "Skipped DB log (user not found)" })
                }
            }

            // For other actions, require authentication
             const token = request.headers.get("authorization")?.split(" ")[1]
             if (!token) {
                 return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
             }
 
             const decoded = verifyAccessToken(token)
             if (!decoded) {
                 return NextResponse.json({ error: "Invalid token" }, { status: 401 })
             }
             const currentUserId = decoded.id

             // Validate body params
             // ... generic logging logic if needed
             // For now we only explicitly support the login requirements from client
             
             return NextResponse.json({ success: true })
        } catch (error) {
            return handleApiError(error)
        }
    }
}
