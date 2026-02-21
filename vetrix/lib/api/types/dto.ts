/**
 * Shared Data Transfer Objects (DTOs) for Client-Server communication
 * @module lib/api/types/dto
 */

// ===================================
// User & Auth DTOs
// ===================================

export interface UserDTO {
    id: number
    username: string
    email: string
    roleId: number
    role?: string // Role name (e.g., 'admin', 'vet', 'assistant')
    statusId: number
    firstName?: string
    lastName?: string
}

export interface LoginInput {
    login: string
    password: string
}

export interface AuthResponse {
    user: UserDTO
    permissions?: string[]
    // Token is handled via HttpOnly cookie, but we might return expiration info
    expiresAt?: string
}

export interface RefreshTokenResponse {
    token: string
    expiresAt: string
}

export interface SessionResponse {
    user: UserDTO | null
    isAuthenticated: boolean
}

// ===================================
// Dashboard DTOs
// ===================================

export interface DashboardMetricsDTO {
    owners: number
    pets: number
    todaysAppointments: number
    monthlyRevenue: number
}

// ===================================
// Audit Log DTOs
// ===================================

export interface AuditLogDTO {
    id: number
    action: string
    details?: string
    performedByUsername?: string
    createdAt: string
}
