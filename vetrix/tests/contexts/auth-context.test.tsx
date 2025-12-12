
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/auth-context'
import { authService } from '@/services/authService'
import { useRouter } from 'next/navigation'
import type { UserDTO } from '@/lib/api/types/dto'

// Mock dependencies
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    usePathname: vi.fn().mockReturnValue('/'),
}))

vi.mock('@/services/authService', () => ({
    authService: {
        login: vi.fn(),
        logout: vi.fn(),
        getCurrentUser: vi.fn(),
    }
}))

// Test component to consume context
const TestComponent = () => {
    const { user, login, logout, hasPermission, isLoading } = useAuth()

    if (isLoading) return <div>Loading...</div>

    return (
        <div>
            <div data-testid="user-name">{user?.username || 'Guest'}</div>
            <button onClick={() => login({ login: 'testuser', password: 'password' })}>Login</button>
            <button onClick={() => logout()}>Logout</button>
            <div data-testid="can-delete">{hasPermission('delete_records') ? 'Yes' : 'No'}</div>
            <div data-testid="can-view">{hasPermission('view_all') ? 'Yes' : 'No'}</div>
        </div>
    )
}

describe('AuthContext', () => {
    const mockRouter = {
        push: vi.fn(),
        refresh: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
    }

    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useRouter).mockReturnValue(mockRouter)
    })

    it('initializes with no user if session check fails', async () => {
        vi.mocked(authService.getCurrentUser).mockResolvedValue(null)

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        expect(screen.getByText('Loading...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByTestId('user-name')).toHaveTextContent('Guest')
        })
    })

    it('initializes with user if session check succeeds', async () => {
        const mockUser: UserDTO = { id: 1, username: 'activeuser', roleId: 3, email: 'active@test.com', statusId: 1 }
        vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser)

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId('user-name')).toHaveTextContent('activeuser')
        })
    })

    it('exercises manual login updating state', async () => {
        vi.mocked(authService.getCurrentUser).mockResolvedValue(null)
        vi.mocked(authService.login).mockResolvedValue({ 
            user: { id: 1, username: 'testuser', roleId: 3, email: 'test@example.com', statusId: 1 }
        } as any)

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => expect(screen.getByTestId('user-name')).toHaveTextContent('Guest'))

        act(() => {
            screen.getByText('Login').click()
        })

        await waitFor(() => {
            expect(screen.getByTestId('user-name')).toHaveTextContent('testuser')
        })
        expect(mockRouter.refresh).toHaveBeenCalled()
    })

    it('exercises logout calling service and clearing state', async () => {
        const mockUser: UserDTO = { id: 1, username: 'logoutuser', roleId: 3, email: 'log@test.com', statusId: 1 }
        vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser)
        vi.mocked(authService.logout).mockResolvedValue()

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => expect(screen.getByTestId('user-name')).toHaveTextContent('logoutuser'))

        await act(async () => {
            screen.getByText('Logout').click()
        })

        expect(authService.logout).toHaveBeenCalled()

        await waitFor(() => {
            expect(screen.getByTestId('user-name')).toHaveTextContent('Guest')
        })
        expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })

    it('checks permissions correctly', async () => {
        // Test as assistant (roleId: 3)
        const mockUser: UserDTO = { id: 1, username: 'assistant', roleId: 3, email: 'assist@test.com', statusId: 1 }
        vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser)

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => expect(screen.getByTestId('user-name')).toHaveTextContent('assistant'))

        // Assistant can view_all but CANNOT delete_records
        expect(screen.getByTestId('can-view')).toHaveTextContent('Yes')
        expect(screen.getByTestId('can-delete')).toHaveTextContent('No')
    })

    it('checks admin permissions correctly', async () => {
        // Test as admin (roleId: 1)
        const mockUser: UserDTO = { id: 1, username: 'admin', roleId: 1, email: 'admin@test.com', statusId: 1 }
        vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser)

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => expect(screen.getByTestId('user-name')).toHaveTextContent('admin'))

        // Admin can do both
        expect(screen.getByTestId('can-view')).toHaveTextContent('Yes')
        expect(screen.getByTestId('can-delete')).toHaveTextContent('Yes')
    })
})
