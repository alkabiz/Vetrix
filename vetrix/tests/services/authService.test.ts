import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authService } from '../../services/authService'
import { httpClient } from '../../src/lib/api/httpClient'

// Mock httpClient
vi.mock('../../src/lib/api/httpClient', () => ({
    httpClient: {
        post: vi.fn(),
        get: vi.fn()
    },
    AppError: class extends Error {}
}))

describe('AuthService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('login calls httpClient.post with correct params', async () => {
        const credentials = { login: 'test', password: 'password' }
        const mockResponse = { user: { id: 1, username: 'test' }, expiresAt: '2024-01-01' }
        
        vi.mocked(httpClient.post).mockResolvedValueOnce(mockResponse)

        const result = await authService.login(credentials)

        // Expect call to relative path (no /api prefix, no credentials param)
        // Credentials are handled by axios global config, not passed here
        expect(httpClient.post).toHaveBeenCalledWith('/auth/login', credentials)
        expect(result).toEqual(mockResponse)
    })

    it('getCurrentUser calls httpClient.get with correct params', async () => {
        const mockUser = { id: 1, username: 'test', roleId: 1, email: 'test@test.com', statusId: 1 }
        vi.mocked(httpClient.get).mockResolvedValueOnce({ user: mockUser })

        const result = await authService.getCurrentUser()

        // Expect call to relative path
        expect(httpClient.get).toHaveBeenCalledWith('/auth/session')
        expect(result).toEqual(mockUser)
    })
})
