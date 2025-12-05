/**
 * @fileoverview Cookie utilities for secure authentication
 * @module lib/auth/cookie-utils
 */

import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE_NAMES, AuthCookieOptions, TOKEN_LIFETIMES } from '@/lib/api/types/auth.types'

/**
 * Get cookie options for access token
 */
export function getAccessTokenCookieOptions(): AuthCookieOptions {
    const isProduction = process.env.NODE_ENV === 'production'

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: TOKEN_LIFETIMES.ACCESS_TOKEN,
        path: '/',
    }
}

/**
 * Get cookie options for refresh token
 */
export function getRefreshTokenCookieOptions(): AuthCookieOptions {
    const isProduction = process.env.NODE_ENV === 'production'

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: TOKEN_LIFETIMES.REFRESH_TOKEN,
        path: '/api/auth',
    }
}

/**
 * Get cookie options for CSRF token
 */
export function getCSRFTokenCookieOptions(): AuthCookieOptions {
    const isProduction = process.env.NODE_ENV === 'production'

    return {
        httpOnly: false, // Needs to be accessible to JavaScript
        secure: isProduction,
        sameSite: 'strict',
        maxAge: TOKEN_LIFETIMES.CSRF_TOKEN,
        path: '/',
    }
}

/**
 * Set authentication cookies on response
 */
export function setAuthCookies(
    response: NextResponse,
    accessToken: string,
    refreshToken: string,
    csrfToken?: string
): void {
    const accessOptions = getAccessTokenCookieOptions()
    const refreshOptions = getRefreshTokenCookieOptions()

    response.cookies.set(AUTH_COOKIE_NAMES.ACCESS_TOKEN, accessToken, accessOptions)
    response.cookies.set(AUTH_COOKIE_NAMES.REFRESH_TOKEN, refreshToken, refreshOptions)

    if (csrfToken) {
        const csrfOptions = getCSRFTokenCookieOptions()
        response.cookies.set(AUTH_COOKIE_NAMES.CSRF_TOKEN, csrfToken, csrfOptions)
    }
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(response: NextResponse): void {
    response.cookies.delete(AUTH_COOKIE_NAMES.ACCESS_TOKEN)
    response.cookies.delete(AUTH_COOKIE_NAMES.REFRESH_TOKEN)
    response.cookies.delete(AUTH_COOKIE_NAMES.CSRF_TOKEN)
}

/**
 * Get access token from request cookies
 */
export function getAccessToken(request: NextRequest): string | null {
    return request.cookies.get(AUTH_COOKIE_NAMES.ACCESS_TOKEN)?.value || null
}

/**
 * Get refresh token from request cookies
 */
export function getRefreshToken(request: NextRequest): string | null {
    return request.cookies.get(AUTH_COOKIE_NAMES.REFRESH_TOKEN)?.value || null
}

/**
 * Get CSRF token from request cookies
 */
export function getCSRFToken(request: NextRequest): string | null {
    return request.cookies.get(AUTH_COOKIE_NAMES.CSRF_TOKEN)?.value || null
}

/**
 * Verify CSRF token from request header matches cookie
 */
export function verifyCSRFToken(request: NextRequest): boolean {
    const cookieToken = getCSRFToken(request)
    const headerToken = request.headers.get('X-CSRF-Token')

    if (!cookieToken || !headerToken) {
        return false
    }

    return cookieToken === headerToken
}

/**
 * Generate a random CSRF token
 */
export function generateCSRFToken(): string {
    return crypto.randomUUID()
}
