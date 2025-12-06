
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/auth-context'
import { authService } from '@/services/authService'
import { useToast } from '@/hooks/use-toast'

// Mocks
vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    refreshToken: vi.fn(),
  },
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(),
}))

vi.mock('@/src/hooks/useAuditLog', () => ({
    logAudit: vi.fn()
}))

// Mock router
const mockPush = vi.fn()
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  usePathname: () => '/',
}))

describe('useAuth Hook', () => {
    const mockToast = vi.fn()
    
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useToast).mockReturnValue({ toast: mockToast } as any)
    })

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
    )

    it('should provide initial unauthenticated state', async () => {
        vi.mocked(authService.getCurrentUser).mockResolvedValue(null)
        vi.mocked(authService.refreshToken).mockRejectedValue(new Error('fail'))

        const { result } = renderHook(() => useAuth(), { wrapper })

        // Initial state is loading
        expect(result.current.isLoading).toBe(true)

        // Wait for effect
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        })

        expect(result.current.user).toBeNull()
        expect(result.current.isAuthenticated).toBe(false)
    })

    it('should restore session on mount if user exists', async () => {
        const mockUser = { id: 1, username: 'test' } as any
        vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser)

        const { result } = renderHook(() => useAuth(), { wrapper })

        await waitFor(() => {
            expect(result.current.user).toEqual(mockUser)
        })
        expect(result.current.isAuthenticated).toBe(true)
    })

    it('should login successfully', async () => {
        vi.mocked(authService.getCurrentUser).mockResolvedValue(null)
        const mockUser = { id: 1, username: 'test' } as any
        vi.mocked(authService.login).mockResolvedValue({ user: mockUser } as any)

        const { result } = renderHook(() => useAuth(), { wrapper })

        await waitFor(() => expect(result.current.isLoading).toBe(false))

        await act(async () => {
            await result.current.login({ login: 'test', password: 'password' })
        })

        expect(result.current.user).toEqual(mockUser)
        expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Bienvenido' }))
        expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('should logout successfully', async () => {
        // Start authenticated
        const mockUser = { id: 1, username: 'test' } as any
        vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser)

        const { result } = renderHook(() => useAuth(), { wrapper })
        await waitFor(() => expect(result.current.user).toEqual(mockUser))

        await act(async () => {
            await result.current.logout()
        })

        expect(authService.logout).toHaveBeenCalled()
        expect(result.current.user).toBeNull()
        expect(mockPush).toHaveBeenCalledWith('/login')
    })
})
