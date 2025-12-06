
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '@/src/app/login/page'
import { AuthProvider } from '@/contexts/auth-context'
import { authService } from '@/services/authService'
import userEvent from '@testing-library/user-event'

// Mocks
vi.mock('@/services/authService', () => ({
    authService: {
        login: vi.fn(),
        logout: vi.fn(),
        getCurrentUser: vi.fn(),
    }
}))

vi.mock('@/src/hooks/useAuditLog', () => ({
    logAudit: vi.fn()
}))

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        refresh: vi.fn(),
    }),
    usePathname: () => '/login',
}))

vi.mock('@/hooks/use-toast', () => ({
    useToast: () => ({
        toast: vi.fn(),
    }),
}))

describe('Login Flow Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(authService.getCurrentUser).mockResolvedValue(null)
    })

    const renderLoginPage = () => {
        return render(
            <AuthProvider>
                <LoginPage />
            </AuthProvider>
        )
    }

    it('should complete full login flow successfully', async () => {
        const user = userEvent.setup()
        const mockUser = { id: 1, username: 'testuser', roleId: 1 }
        vi.mocked(authService.login).mockResolvedValue({ user: mockUser } as any)

        renderLoginPage()

        // Wait for initial session check
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /ingresar/i })).toBeEnabled()
        })

        // Fill form
        await user.type(screen.getByRole('textbox', { name: /usuario o email/i }), 'testuser')
        await user.type(screen.getByLabelText(/contraseña/i), 'password123')

        // Submit
        await user.click(screen.getByRole('button', { name: /ingresar/i }))

        // Assert
        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith({
                login: 'testuser',
                password: 'password123'
            })
            // Should redirect to home
            expect(mockPush).toHaveBeenCalledWith('/')
        })
    })

    it('should handle login failure and display error', async () => {
        const user = userEvent.setup()
        vi.mocked(authService.login).mockRejectedValue(new Error('Invalid credentials'))

        renderLoginPage()

        await waitFor(() => expect(screen.getByRole('button')).toBeEnabled())

        await user.type(screen.getByRole('textbox', { name: /usuario o email/i }), 'wrong')
        await user.type(screen.getByLabelText(/contraseña/i), 'wrong')
        await user.click(screen.getByRole('button', { name: /ingresar/i }))

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
            expect(mockPush).not.toHaveBeenCalled()
        })
    })
})
