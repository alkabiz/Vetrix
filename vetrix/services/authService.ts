/**
 * @fileoverview Client-side authentication service
 * Handles all authentication-related operations using HttpOnly cookies
 * @module services/authService
 */

import type { LoginInput, AuthResponse, UserDTO, RefreshTokenResponse } from '@/lib/api/types/dto'
import { httpClient } from '@/src/lib/api/httpClient'

/**
 * Client-side authentication service
 * Provides abstraction layer for cookie-based authentication
 */
class AuthenticationService {
    // Base URL is now handled by httpClient (axios baseURL)
    // We just append specific paths. 
    // Note: httpClient has baseURL='api', but auth routes are /api/auth.
    // If httpClient base is /api, we call /auth/login. 
    // Wait, let's verify if httpClient baseURL is /api or not.
    // Previous step set baseURL: "/api". So we call "/auth/login".
    
    private getPath(path: string) {
        return `/auth${path}`
    }

    /**
     * Login with credentials
     * Tokens are automatically set as HttpOnly cookies by the server
     */
    async login(credentials: LoginInput): Promise<AuthResponse> {
        return httpClient.post<AuthResponse>(this.getPath('/login'), credentials)
    }

    /**
     * Logout current user
     * Clears all authentication cookies
     */
    async logout(): Promise<void> {
        return httpClient.post<void>(this.getPath('/logout'))
    }

    /**
     * Refresh access token
     * Uses refresh token from HttpOnly cookie
     */
    async refreshToken(): Promise<RefreshTokenResponse> {
        const response = await httpClient.post<{ expiresAt: string }>(this.getPath('/refresh'))
        
        return {
            token: '', // Token is in HTTPOnly cookie
            expiresAt: response.expiresAt,
        }
    }

    /** 
     * Get current user session
     * Note: This requires the server to implement /api/auth/session endpoint
     */
    async getCurrentUser(): Promise<UserDTO | null> {
        try {
            const data = await httpClient.get<{ user: UserDTO }>(this.getPath('/session'))
            return data.user
        } catch (error) {
            // If session check fails (e.g. 401), we just return null
            console.warn('Failed to get current user session:', error)
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
        if (typeof document === 'undefined') return null
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
}

// Export singleton instance
export const authService = new AuthenticationService()

// Export class for testing purposes
export { AuthenticationService }
