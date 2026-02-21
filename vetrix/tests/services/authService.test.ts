
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { authService } from '@/services/authService'
import { httpClient } from '@/src/lib/api/httpClient'

// Mock httpClient
vi.mock('@/src/lib/api/httpClient', () => ({
  httpClient: {
    post: vi.fn(),
    get: vi.fn(),
    instance: {
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    },
  },
}))

describe('AuthenticationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should call httpClient.post with correct arguments', async () => {
      const credentials = { login: 'testuser', password: 'password123' }
      const mockResponse = { user: { id: 1, username: 'testuser' } }
      
      // Setup mock
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      // Execute
      const result = await authService.login(credentials)

      // Assert
      expect(httpClient.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('logout', () => {
    it('should call httpClient.post to logout', async () => {
      await authService.logout()
      expect(httpClient.post).toHaveBeenCalledWith('/auth/logout')
    })
  })

  describe('refreshToken', () => {
    it('should call refresh endpoint and return formatted response', async () => {
      const mockResponse = { expiresAt: '2025-01-01T00:00:00Z' }
      vi.mocked(httpClient.post).mockResolvedValue(mockResponse)

      const result = await authService.refreshToken()

      expect(httpClient.post).toHaveBeenCalledWith('/auth/refresh')
      expect(result).toEqual({ token: '', expiresAt: mockResponse.expiresAt })
    })
  })

  describe('getCurrentUser', () => {
    it('should return user and permissions when session exists', async () => {
      const mockUser = { id: 1, username: 'test' }
      const mockPermissions = ['users.view', 'users.create']
      vi.mocked(httpClient.get).mockResolvedValue({ user: mockUser, permissions: mockPermissions })

      const result = await authService.getCurrentUser()

      expect(httpClient.get).toHaveBeenCalledWith('/auth/session')
      expect(result).toEqual({ user: mockUser, permissions: mockPermissions })
    })

    it('should return empty permissions array when server omits them', async () => {
      const mockUser = { id: 1, username: 'test' }
      vi.mocked(httpClient.get).mockResolvedValue({ user: mockUser })

      const result = await authService.getCurrentUser()

      expect(result).toEqual({ user: mockUser, permissions: [] })
    })

    it('should return null when session check fails', async () => {
      vi.mocked(httpClient.get).mockRejectedValue(new Error('Unauthorized'))

      const result = await authService.getCurrentUser()

      expect(result).toBeNull()
    })

    it('should return null when user is null in response', async () => {
      vi.mocked(httpClient.get).mockResolvedValue({ user: null })

      const result = await authService.getCurrentUser()

      expect(result).toBeNull()
    })
  })

  // Testing Interceptors logic would require exposing the interceptor callback
  // Since setupInterceptors is private and runs in constructor, getting access to it is tricky with simple mocks
  // For unit testing purposes here, we typically trust the libraries (axios) 
  // or use integration tests to verify the flow. 
  // However, we can verify that interceptors ARE registered.

})
