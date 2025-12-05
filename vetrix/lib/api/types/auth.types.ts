/**
 * @fileoverview Authentication-specific types and DTOs
 * @module lib/api/types/auth.types
 */

import type { User } from '@/lib/database/database'

// ============================================================================
// Request DTOs
// ============================================================================

/**
 * Login credentials (username or email + password)
 */
export interface LoginCredentials {
    /** Username or email address */
    readonly login: string
    /** Plain text password (will be hashed server-side) */
    readonly password: string
}

/**
 * User registration request
 */
export interface RegisterRequest {
    readonly username: string
    readonly email: string
    readonly password: string
    readonly roleId: number
}

/**
 * Token refresh request
 */
export interface RefreshTokenRequest {
    /** Refresh token from HttpOnly cookie */
    readonly refreshToken?: string
}

// ============================================================================
// Response DTOs
// ============================================================================

/**
 * Successful authentication response
 */
export interface AuthResponse {
    /** Access token (short-lived) */
    readonly token: string
    /** User information */
    readonly user: User
    /** Token expiration time (ISO string) */
    readonly expiresAt: string
    /** Whether this is a new session */
    readonly isNewSession?: boolean
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
    /** New access token */
    readonly token: string
    /** New access token expiration */
    readonly expiresAt: string
}

/**
 * Logout response
 */
export interface LogoutResponse {
    readonly success: boolean
    readonly message?: string
}

/**
 * Session info response
 */
export interface SessionResponse {
    readonly user: User | null
    readonly isAuthenticated: boolean
    readonly expiresAt?: string
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Authentication error codes
 */
export enum AuthErrorCode {
    // Authentication
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
    ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
    EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',

    // Token errors
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',
    TOKEN_INVALID = 'TOKEN_INVALID',
    TOKEN_MISSING = 'TOKEN_MISSING',
    CSRF_INVALID = 'CSRF_INVALID',
    REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
    REFRESH_TOKEN_INVALID = 'REFRESH_TOKEN_INVALID',

    // Session errors
    SESSION_EXPIRED = 'SESSION_EXPIRED',
    SESSION_INVALID = 'SESSION_INVALID',
    CONCURRENT_SESSION = 'CONCURRENT_SESSION',

    // Authorization
    INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
    ROLE_REQUIRED = 'ROLE_REQUIRED',

    // Registration
    USERNAME_TAKEN = 'USERNAME_TAKEN',
    EMAIL_TAKEN = 'EMAIL_TAKEN',
    INVALID_EMAIL = 'INVALID_EMAIL',
    WEAK_PASSWORD = 'WEAK_PASSWORD',

    // Two-factor
    TWO_FACTOR_REQUIRED = 'TWO_FACTOR_REQUIRED',
    TWO_FACTOR_CODE_INVALID = 'TWO_FACTOR_CODE_INVALID',

    // Rate limiting
    TOO_MANY_ATTEMPTS = 'TOO_MANY_ATTEMPTS',
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

    // Unknown
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Authentication error response
 */
export interface AuthErrorResponse {
    readonly error: string
    readonly code: AuthErrorCode
    readonly details?: Record<string, string[]>
    readonly timestamp?: string
}

// ============================================================================
// Database Types (Refresh Tokens)
// ============================================================================

/**
 * Refresh token stored in database
 */
export interface RefreshToken {
    readonly id: string
    readonly userId: number
    readonly token: string
    readonly expiresAt: string // ISO datetime string
    readonly createdAt: string // ISO datetime string
    readonly revokedAt?: string | null // ISO datetime string
    readonly replacedByToken?: string | null
    readonly deviceInfo?: string | null
    readonly ipAddress?: string | null
}

/**
 * Refresh token creation payload
 */
export interface CreateRefreshTokenPayload {
    readonly userId: number
    readonly token: string
    readonly expiresAt: Date
    readonly deviceInfo?: string
    readonly ipAddress?: string
}

// ============================================================================
// Cookie Configuration
// ============================================================================

/**
 * Cookie options for auth tokens
 */
export interface AuthCookieOptions {
    readonly httpOnly: boolean
    readonly secure: boolean
    readonly sameSite: 'strict' | 'lax' | 'none'
    readonly maxAge: number
    readonly path: string
}

/**
 * Cookie names
 */
export const AUTH_COOKIE_NAMES = {
    ACCESS_TOKEN: 'vetrix_access_token',
    REFRESH_TOKEN: 'vetrix_refresh_token',
    CSRF_TOKEN: 'vetrix_csrf_token',
} as const

// ============================================================================
// Token Configuration
// ============================================================================

/**
 * Token lifetimes in seconds
 */
export const TOKEN_LIFETIMES = {
    ACCESS_TOKEN: 15 * 60, // 15 minutes
    REFRESH_TOKEN: 7 * 24 * 60 * 60, // 7 days
    CSRF_TOKEN: 24 * 60 * 60, // 24 hours
} as const

// ============================================================================
// Permission Types
// ============================================================================

/**
 * System permissions
 */
export type Permission =
    | 'manage_users'
    | 'manage_medical_records'
    | 'manage_appointments'
    | 'manage_pets'
    | 'manage_owners'
    | 'manage_invoices'
    | 'access_admin_panel'
    | 'manage_system_settings'
    | 'view_reports'
    | 'manage_reports'
    | 'view_medical_records'
    | 'create_invoices'
    | 'view_invoices'
    | 'delete_records'
    | 'view_all'
    | 'create_basic'
