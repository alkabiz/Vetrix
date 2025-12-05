/**
 * @fileoverview Centralized authentication middleware
 * @module lib/api/middleware/auth-middleware
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth/token-service'
import { getAccessToken, verifyCSRFToken } from '@/lib/auth/cookie-utils'
import { AuthErrorCode } from '@/lib/api/types/auth.types'
import type { User } from '@/lib/database/database'

export interface AuthenticatedRequest extends NextRequest {
    user?: User
    userId?: number
}

/** Verify authentication middleware
* Checks access token from HttpOnly cookie
*/
export async function requireAuth(
    request: NextRequest,
    requireCSRF: boolean = true
): Promise<{ user: User; userId: number } | NextResponse> {
    // Get access token from cookie
    const accessToken = getAccessToken(request)

    if (!accessToken) {
        return NextResponse.json(
            {
                error: 'Authentication required',
                code: AuthErrorCode.TOKEN_MISSING,
            },
            { status: 401 }
        )
    }

    try {
        const decoded = await verifyAccessToken(accessToken)

        if (!decoded) {
            return NextResponse.json(
                {
                    error: 'Invalid token',
                    code: AuthErrorCode.TOKEN_INVALID,
                },
                { status: 401 }
            )
        }

        if (requireCSRF && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
            if (!verifyCSRFToken(request)) {
                return NextResponse.json(
                    {
                        error: 'CSRF token validation failed',
                        code: AuthErrorCode.CSRF_INVALID,
                    },
                    { status: 403 }
                )
            }
        }

        // Map role name to roleId for Database User type
        const roleIdMap: Record<string, number> = {
            'admin': 1,
            'vet': 2,
            'assistant': 3,
        }

        // In production, fetch the full user from database by decoded.id
        // For now, we'll construct a minimal User object from the token
        const user: Partial<User> = {
            id: decoded.id,
            username: decoded.username || '',
            email: decoded.email || '',
            passwordHash: '', // Not included in token for security
            roleId: roleIdMap[decoded.role] || 3, // Default to assistant if role not found
            statusId: 1, // Default active status
            failedLoginAttempts: 0,
            mustChangePassword: false,
            twoFactorEnabled: false,
            sessionTimeoutMinutes: 30,
            timezone: 'UTC',
            preferredLanguage: 'es',
            emailNotifications: true,
            smsNotifications: false,
            isEmailVerified: true,
            apiAccessEnabled: false,
            passwordChangedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        return { user: user as User, userId: decoded.id }
    } catch (error: any) {
        console.error('Auth error:', error)
        return NextResponse.json(
            {
                error: 'Invalid or expired token',
                code: AuthErrorCode.TOKEN_INVALID,
                details: error.message,
            },
            { status: 401 }
        )
    }
}

export async function optionalAuth(request: NextRequest): Promise<{
    user: User | null
    userId: number | null
}> {
    const accessToken = getAccessToken(request)

    if (!accessToken) {
        return { user: null, userId: null }
    }

    try {
        const decoded = await verifyAccessToken(accessToken)
        if (!decoded) {
            return { user: null, userId: null }
        }

        // Map role name to roleId for Database User type
        const roleIdMap: Record<string, number> = {
            'admin': 1,
            'vet': 2,
            'assistant': 3,
        }

        const user: Partial<User> = {
            id: decoded.id,
            username: decoded.username || '',
            email: decoded.email || '',
            passwordHash: '',
            roleId: roleIdMap[decoded.role] || 3, // Default to assistant if role not found
            statusId: 1,
            failedLoginAttempts: 0,
            mustChangePassword: false,
            twoFactorEnabled: false,
            sessionTimeoutMinutes: 30,
            timezone: 'UTC',
            preferredLanguage: 'es',
            emailNotifications: true,
            smsNotifications: false,
            isEmailVerified: true,
            apiAccessEnabled: false,
            passwordChangedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        return { user: user as User, userId: decoded.id }
    } catch (error) {
        console.warn('Optional auth: Invalid or expired token, proceeding as unauthenticated.')
        return { user: null, userId: null }
    }
}

export async function requirePermission(
    request: NextRequest,
    permission: string
): Promise<{ user: User; userId: number } | NextResponse> {
    const authResult = await requireAuth(request)

    if (authResult instanceof NextResponse) {
        return authResult
    }

    const { user, userId } = authResult

    // Import permission checker
    const { hasPermission } = await import('@/lib/auth/auth')

    const roleMap: Record<number, 'admin' | 'vet' | 'assistant'> = {
        1: 'admin',
        2: 'vet',
        3: 'assistant',
    }

    const roleName = roleMap[user.roleId]

    if (!roleName || !hasPermission(roleName, permission)) {
        return NextResponse.json(
            {
                error: 'Insufficient permissions',
                code: AuthErrorCode.INSUFFICIENT_PERMISSIONS,
                details: { required: permission, userRole: roleName || 'unknown' },
            },
            { status: 403 }
        )
    }

    return { user, userId }
}
