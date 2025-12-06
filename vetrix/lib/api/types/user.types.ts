import { User } from "@/lib/database/database"

export type UserEntity = User

/**
 * UserDTO - API response type for user data
 * Excludes sensitive fields like passwordHash
 */
export interface UserDTO extends Omit<UserEntity, "passwordHash" | "currentSessionId"> {
    // Add any computed fields if needed (UserDTO already inherits createdAt as required string)
}

/**
 * UserInput - Input type for creating a new user
 * Maps to registration form data
 */
export interface UserInput {
    username: string
    email: string
    password: string
    roleId: number
}

/**
 * UserUpdateInput - Input type for updating an existing user
 * All fields except id are optional
 */
export interface UserUpdateInput {
    username?: string
    email?: string
    roleId?: number
    statusId?: number
}

/**
 * UserFilter - Filter options for querying users
 */
export interface UserFilter {
    roleId?: number
    statusId?: number
    search?: string
}

// ============================================================================
// Pagination Types
// ============================================================================

/**
 * PaginationParams - Parameters for paginated queries
 */
export interface PaginationParams {
    page: number
    limit: number
}

/**
 * PaginatedResponse - Generic paginated response wrapper
 */
export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
        hasNextPage: boolean
        hasPreviousPage: boolean
    }
}

// ============================================================================
// Bulk Operation Types
// ============================================================================

/**
 * BulkDeleteRequest - Request payload for bulk delete operations
 */
export interface BulkDeleteRequest {
    userIds: number[]
}

/**
 * BulkRoleChangeRequest - Request payload for bulk role change
 */
export interface BulkRoleChangeRequest {
    userIds: number[]
    roleId: number
}

// ============================================================================
// Audit Log Types
// ============================================================================

/**
 * AuditAction - Types of actions that can be logged
 */
export type AuditAction =
    | "user_created"
    | "user_updated"
    | "user_deleted"
    | "user_role_changed"
    | "bulk_delete"
    | "bulk_role_change"
    | "login"
    | "login_failed"

/**
 * AuditLog - Audit log entry for user actions
 */
export interface AuditLog {
    id: number
    userId?: number | null
    action: AuditAction
    performedBy: number
    performedByUsername?: string
    details?: string | null
    createdAt: string
}

// ============================================================================
// Export Types
// ============================================================================

/**
 * ExportFormat - Supported export formats
 */
export type ExportFormat = "csv" | "pdf"

/**
 * ExportOptions - Options for exporting user data
 */
export interface ExportOptions {
    format: ExportFormat
    userIds?: number[] // If provided, export only these users
    includeFields?: string[] // Fields to include in export
}
