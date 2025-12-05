import { getDatabase, type User, type AuditLog } from "@/lib/database/database"
import { PaginatedResponse, UserUpdateInput, AuditAction } from "@/lib/api/types/user.types"

export class UserService {
    // ============================================================================
    // Query Methods
    // ============================================================================

    /**
     * Get all users without pagination
     */
    static getAll(): User[] {
        const db = getDatabase()
        return db.prepare("SELECT * FROM usr_users ORDER BY createdAt DESC").all() as User[]
    }

    /**
     * Get paginated users with optional filtering
     */
    static getAllPaginated(
        page: number = 1,
        limit: number = 20,
        search?: string,
        roleId?: number,
        statusId?: number
    ): PaginatedResponse<User> {
        const db = getDatabase()
        const offset = (page - 1) * limit

        // Build WHERE clause dynamically
        const conditions: string[] = []
        const params: any[] = []

        if (search) {
            conditions.push("(username LIKE ? OR email LIKE ?)")
            const searchPattern = `%${search}%`
            params.push(searchPattern, searchPattern)
        }

        if (roleId !== undefined) {
            conditions.push("roleId = ?")
            params.push(roleId)
        }

        if (statusId !== undefined) {
            conditions.push("statusId = ?")
            params.push(statusId)
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

        // Get total count
        const countQuery = `SELECT COUNT(*) as count FROM usr_users ${whereClause}`
        const countResult = db.prepare(countQuery).get(...params) as { count: number }
        const totalItems = countResult.count

        // Get paginated data
        const dataQuery = `
            SELECT * FROM usr_users 
            ${whereClause}
            ORDER BY createdAt DESC 
            LIMIT ? OFFSET ?
        `
        const data = db.prepare(dataQuery).all(...params, limit, offset) as User[]

        const totalPages = Math.ceil(totalItems / limit)

        return {
            data,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        }
    }

    /**
     * Get user by ID
     */
    static getById(id: number): User | undefined {
        const db = getDatabase()
        return db.prepare("SELECT * FROM usr_users WHERE id = ?").get(id) as User | undefined
    }

    // ============================================================================
    // Mutation Methods
    // ============================================================================

    /**
     * Update user
     */
    static update(id: number, data: UserUpdateInput): User {
        const db = getDatabase()

        const fields: string[] = []
        const values: any[] = []

        if (data.username !== undefined) {
            fields.push("username = ?")
            values.push(data.username)
        }

        if (data.email !== undefined) {
            fields.push("email = ?")
            values.push(data.email)
        }

        if (data.roleId !== undefined) {
            fields.push("roleId = ?")
            values.push(data.roleId)
        }

        if (data.statusId !== undefined) {
            fields.push("statusId = ?")
            values.push(data.statusId)
        }

        fields.push("updatedAt = datetime('now')")
        values.push(id)

        const query = `
            UPDATE usr_users 
            SET ${fields.join(", ")}
            WHERE id = ?
        `

        db.prepare(query).run(...values)

        const updatedUser = this.getById(id)
        if (!updatedUser) {
            throw new Error(`User with id ${id} not found after update`)
        }

        return updatedUser
    }

    /**
     * Delete user by ID
     */
    static delete(id: number): void {
        const db = getDatabase()
        db.prepare("DELETE FROM usr_users WHERE id = ?").run(id)
    }

    /**
     * Bulk delete users
     */
    static bulkDelete(userIds: number[]): void {
        const db = getDatabase()
        const placeholders = userIds.map(() => "?").join(",")
        const query = `DELETE FROM usr_users WHERE id IN (${placeholders})`
        db.prepare(query).run(...userIds)
    }

    /**
     * Bulk update role
     */
    static bulkUpdateRole(userIds: number[], roleId: number): void {
        const db = getDatabase()
        const placeholders = userIds.map(() => "?").join(",")
        const query = `
            UPDATE usr_users 
            SET roleId = ?, updatedAt = datetime('now')
            WHERE id IN (${placeholders})
        `
        db.prepare(query).run(roleId, ...userIds)
    }

    // ============================================================================
    // Audit Log Methods
    // ============================================================================

    /**
     * Create audit log entry
     */
    static createAuditLog(
        action: AuditAction,
        performedBy: number,
        userId?: number,
        details?: string
    ): void {
        const db = getDatabase()

        // First, ensure the audit_logs table exists
        db.exec(`
            CREATE TABLE IF NOT EXISTS usr_audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                action TEXT NOT NULL,
                performed_by INTEGER NOT NULL,
                details TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES usr_users(id) ON DELETE SET NULL,
                FOREIGN KEY (performed_by) REFERENCES usr_users(id) ON DELETE CASCADE
            )
        `)

        const query = `
            INSERT INTO usr_audit_logs (user_id, action, performed_by, details)
            VALUES (?, ?, ?, ?)
        `

        db.prepare(query).run(userId || null, action, performedBy, details || null)
    }

    /**
     * Get audit logs with optional filtering by user
     */
    static getAuditLogs(userId?: number, limit: number = 100): AuditLog[] {
        const db = getDatabase()

        // Ensure table exists
        db.exec(`
            CREATE TABLE IF NOT EXISTS usr_audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                action TEXT NOT NULL,
                performed_by INTEGER NOT NULL,
                details TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (user_id) REFERENCES usr_users(id) ON DELETE SET NULL,
                FOREIGN KEY (performed_by) REFERENCES usr_users(id) ON DELETE CASCADE
            )
        `)

        let query = `
            SELECT 
                al.*,
                u.username as performedByUsername
            FROM usr_audit_logs al
            LEFT JOIN usr_users u ON al.performed_by = u.id
        `

        const params: any[] = []

        if (userId !== undefined) {
            query += " WHERE al.user_id = ?"
            params.push(userId)
        }

        query += " ORDER BY al.created_at DESC LIMIT ?"
        params.push(limit)

        return db.prepare(query).all(...params) as AuditLog[]
    }
}
