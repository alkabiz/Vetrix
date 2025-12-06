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

        expect(httpClient.post).toHaveBeenCalledWith('/api/auth/login', credentials, {
            credentials: 'include'
        })
        expect(result).toEqual(mockResponse)
    })

    it('getCurrentUser calls httpClient.get with correct params', async () => {
        const mockUser = { id: 1, username: 'test', roleId: 1, email: 'test@test.com', statusId: 1 }
        vi.mocked(httpClient.get).mockResolvedValueOnce({ user: mockUser })

        const result = await authService.getCurrentUser()

        expect(httpClient.get).toHaveBeenCalledWith('/api/auth/session', {
            credentials: 'include'
        })
        expect(result).toEqual(mockUser)
    })
})
