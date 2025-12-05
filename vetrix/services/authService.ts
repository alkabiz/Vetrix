/**
 * @fileoverview Client-side authentication service
 * Handles all authentication-related operations using HttpOnly cookies
 * @module services/authService
 */

import type { LoginInput, AuthResponse, UserDTO } from '@/lib/api/types/dto'
import type { RefreshTokenResponse } from '@/lib/api/types/auth.types' // Keep specifics if needed, or move them

/**
 * Client-side authentication service
 * Provides abstraction layer for cookie-based authentication
 */
class AuthenticationService {
    private baseUrl = '/api/auth'

    /**
     * Login with credentials
     * Tokens are automatically set as HttpOnly cookies by the server
     */
    async login(credentials: LoginInput): Promise<AuthResponse> {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
            credentials: 'include', // Important: include cookies
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Login failed')
        }

        const data = await response.json()
        return {
            user: data.user,
            expiresAt: data.expiresAt,
        }
    }

    /**
     * Logout current user
     * Clears all authentication cookies
     */
    async logout(): Promise<void> {
        const response = await fetch(`${this.baseUrl}/logout`, {
            method: 'POST',
            credentials: 'include',
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Logout failed')
        }
    }

    /**
     * Refresh access token
     * Uses refresh token from HttpOnly cookie
     */
    async refreshToken(): Promise<RefreshTokenResponse> {
        const response = await fetch(`${this.baseUrl}/refresh`, {
            method: 'POST',
            credentials: 'include',
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Token refresh failed')
        }

        const data = await response.json()
        return {
            token: '', // Token is in HTTPOnly cookie
            expiresAt: data.expiresAt,
        }
    }

    /** 
     * Get current user session
     * Note: This requires the server to implement /api/auth/session endpoint
     */
    async getCurrentUser(): Promise<UserDTO | null> {
        try {
            const response = await fetch(`${this.baseUrl}/session`, {
                credentials: 'include',
            })

            if (!response.ok) {
                return null
            }

            const data = await response.json()
            return data.user || null
        } catch (error) {
            console.error('Failed to get current user:', error)
            return null
        }
    }

    /**
     * Check if user is authenticated
     * This is a best-effort check on the client side
     * The server always validates the actual token
     */
    async isAuthenticated(): Promise<boolean> {
        const user = await this.getCurrentUser()
        return user !== null
    }

    /**
     * Get CSRF token from cookie for making state-changing requests
     */
    getCSRFToken(): string | null {
        const name = 'vetrix_csrf_token='
        const decodedCookie = decodeURIComponent(document.cookie)
        const cookieArray = decodedCookie.split(';')

        for (let cookie of cookieArray) {
            cookie = cookie.trim()
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length)
            }
        }
        return null
    }

    /**
     * Make authenticated API request with CSRF protection
     */
    async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
        const csrfToken = this.getCSRFToken()
        const headers = new Headers(options.headers)

        if (csrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method || 'GET')) {
            headers.set('X-CSRF-Token', csrfToken)
        }

        return fetch(url, {
            ...options,
            headers,
            credentials: 'include',
        })
    }
}

// Export singleton instance
export const authService = new AuthenticationService()

// Export class for testing purposes
export { AuthenticationService }
