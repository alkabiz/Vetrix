
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
        refreshToken: vi.fn(),
    }
}))

vi.mock('@/src/hooks/useAuditLog', () => ({
    logAudit: vi.fn(),
}))

// Test component to consume context
const TestComponent = () => {
    const { user, permissions, login, logout, hasPermission, isLoading } = useAuth()

    if (isLoading) return <div>Loading...</div>

    return (
        <div>
            <div data-testid="user-name">{user?.username || 'Guest'}</div>
            <div data-testid="permissions-count">{permissions.length}</div>
            <button onClick={() => login({ login: 'testuser', password: 'password' })}>Login</button>
            <button onClick={() => logout()}>Logout</button>
            <div data-testid="can-delete">{hasPermission('delete_records') ? 'Yes' : 'No'}</div>
            <div data-testid="can-view">{hasPermission('view_all') ? 'Yes' : 'No'}</div>
            <div data-testid="can-manage-users">{hasPermission('manage_users') ? 'Yes' : 'No'}</div>
            <div data-testid="has-users-view">{hasPermission('users.view') ? 'Yes' : 'No'}</div>
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

    it('initializes with user and permissions if session check succeeds', async () => {
        const mockUser: UserDTO = { id: 1, username: 'activeuser', roleId: 3, email: 'active@test.com', statusId: 1 }
        vi.mocked(authService.getCurrentUser).mockResolvedValue({
            user: mockUser,
            permissions: ['view_all', 'create_basic']
        })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId('user-name')).toHaveTextContent('activeuser')
            expect(screen.getByTestId('permissions-count')).toHaveTextContent('2')
        })
    })

    it('exercises manual login updating state with permissions', async () => {
        vi.mocked(authService.getCurrentUser).mockResolvedValue(null)
        vi.mocked(authService.login).mockResolvedValue({
            user: { id: 1, username: 'testuser', roleId: 1, email: 'test@example.com', statusId: 1 },
            permissions: ['users.view', 'users.create', 'manage_users'],
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
            expect(screen.getByTestId('permissions-count')).toHaveTextContent('3')
        })
        expect(mockRouter.refresh).toHaveBeenCalled()
    })

    it('exercises logout calling service and clearing state', async () => {
        const mockUser: UserDTO = { id: 1, username: 'logoutuser', roleId: 3, email: 'log@test.com', statusId: 1 }
        vi.mocked(authService.getCurrentUser).mockResolvedValue({
            user: mockUser,
            permissions: ['view_all']
        })
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
            expect(screen.getByTestId('permissions-count')).toHaveTextContent('0')
        })
        expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })

    it('checks server permissions when available', async () => {
        const mockUser: UserDTO = { id: 1, username: 'admin', roleId: 1, email: 'admin@test.com', statusId: 1 }
        vi.mocked(authService.getCurrentUser).mockResolvedValue({
            user: mockUser,
            permissions: ['users.view', 'users.create', 'manage_users', 'delete_records', 'view_all']
        })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => expect(screen.getByTestId('user-name')).toHaveTextContent('admin'))

        // Server permissions should be used
        expect(screen.getByTestId('has-users-view')).toHaveTextContent('Yes')
        expect(screen.getByTestId('can-manage-users')).toHaveTextContent('Yes')
        expect(screen.getByTestId('can-delete')).toHaveTextContent('Yes')
        expect(screen.getByTestId('can-view')).toHaveTextContent('Yes')
    })

    it('falls back to roleId-based permissions when no server permissions', async () => {
        const mockUser: UserDTO = { id: 1, username: 'assistant', roleId: 3, email: 'assist@test.com', statusId: 1 }
        vi.mocked(authService.getCurrentUser).mockResolvedValue({
            user: mockUser,
            permissions: [] // No server permissions
        })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => expect(screen.getByTestId('user-name')).toHaveTextContent('assistant'))

        // Fallback: Assistant (roleId=3) can view_all but CANNOT delete_records or manage_users
        expect(screen.getByTestId('can-view')).toHaveTextContent('Yes')
        expect(screen.getByTestId('can-delete')).toHaveTextContent('No')
        expect(screen.getByTestId('can-manage-users')).toHaveTextContent('No')
    })

    it('checks admin permissions correctly with fallback', async () => {
        // Test as admin (roleId: 1) with no server permissions (fallback)
        const mockUser: UserDTO = { id: 1, username: 'admin', roleId: 1, email: 'admin@test.com', statusId: 1 }
        vi.mocked(authService.getCurrentUser).mockResolvedValue({
            user: mockUser,
            permissions: []
        })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => expect(screen.getByTestId('user-name')).toHaveTextContent('admin'))

        // Admin (roleId=1) should have all fallback permissions
        expect(screen.getByTestId('can-view')).toHaveTextContent('Yes')
        expect(screen.getByTestId('can-delete')).toHaveTextContent('Yes')
        expect(screen.getByTestId('can-manage-users')).toHaveTextContent('Yes')
    })
})
