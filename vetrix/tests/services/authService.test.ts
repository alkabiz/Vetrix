
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { authService } from '@/services/authService'
import type { UserDTO } from '@/lib/api/types/dto'

// Mock global fetch
const globalFetch = vi.fn()
global.fetch = globalFetch

describe('AuthenticationService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockUser: UserDTO = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roleId: 2,
        statusId: 1
    }

    describe('login', () => {
        it('successfully logs in and returns user data', async () => {
            const mockResponse = {
                user: mockUser,
                expiresAt: '2023-01-01T00:00:00Z'
            }

            globalFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse
            })

            const result = await authService.login({ login: 'testuser', password: 'password' })

            expect(globalFetch).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ login: 'testuser', password: 'password' }),
                credentials: 'include'
            }))
            expect(result.user).toEqual(mockUser)
            expect(result.expiresAt).toBe(mockResponse.expiresAt)
        })

        it('throws error on failed login', async () => {
            globalFetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: 'Invalid credentials' })
            })

            await expect(authService.login({ login: 'wrong', password: 'wrong' }))
                .rejects.toThrow('Invalid credentials')
        })
    })

    describe('getCurrentUser', () => {
        it('returns user when session exists', async () => {
            globalFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ user: mockUser })
            })

            const user = await authService.getCurrentUser()
            expect(user).toEqual(mockUser)
            expect(globalFetch).toHaveBeenCalledWith('/api/auth/session', expect.objectContaining({
                credentials: 'include'
            }))
        })

        it('returns null when session call fails', async () => {
            globalFetch.mockResolvedValueOnce({
                ok: false
            })

            const user = await authService.getCurrentUser()
            expect(user).toBeNull()
        })

        it('returns null on fetch error', async () => {
            globalFetch.mockRejectedValueOnce(new Error('Network error'))

            const user = await authService.getCurrentUser()
            expect(user).toBeNull()
        })
    })

    describe('logout', () => {
        it('calls logout endpoint successfully', async () => {
            globalFetch.mockResolvedValueOnce({
                ok: true
            })

            await authService.logout()
            expect(globalFetch).toHaveBeenCalledWith('/api/auth/logout', expect.anything())
        })

        it('throws error when logout command fails', async () => {
            globalFetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: 'Logout failed' })
            })

            await expect(authService.logout()).rejects.toThrow('Logout failed')
        })
    })

    describe('isAuthenticated', () => {
        it('returns true when user exists', async () => {
            // Mock getCurrentUser internally calling fetch
            globalFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ user: mockUser })
            })

            const isAuth = await authService.isAuthenticated()
            expect(isAuth).toBe(true)
        })

        it('returns false when user is null', async () => {
            globalFetch.mockResolvedValueOnce({
                ok: false
            })

            const isAuth = await authService.isAuthenticated()
            expect(isAuth).toBe(false)
        })
    })
})
