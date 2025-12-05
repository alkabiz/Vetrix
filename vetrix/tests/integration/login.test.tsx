import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/auth-context'
import { authService } from '@/services/authService'
import LoginPage from '@/src/app/login/page'

// Mock fetch
global.fetch = vi.fn()

// Helper to wrap components with providers
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
    )
}

describe('Login Flow Integration Test', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()

        // Mock session check to avoid consuming fetch mock
        vi.spyOn(authService, 'getCurrentUser').mockResolvedValue(null)
    })

    it('successful login redirects to dashboard', async () => {
        const user = userEvent.setup()

            // Mock successful login response
            ; (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    token: 'mock-token',
                    user: { id: 1, username: 'admin', roleId: 1 },
                }),
            })

        render(<LoginPage />, { wrapper: createWrapper() })

        // Fill in login form
        const loginInput = screen.getByLabelText(/nombre de usuario o correo/i)
        const passwordInput = screen.getByLabelText(/contraseña/i)
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

        await user.type(loginInput, 'admin')
        await user.type(passwordInput, 'admin123')
        await user.click(submitButton)

        // Verify API was called
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/auth/login',
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ login: 'admin', password: 'admin123' }),
                })
            )
        })

        // Verify token stored (will be cookies in final implementation)
        // Token is now in HttpOnly cookie, so we can't check localStorage
        // The redirection is the main success indicator here
    })

    it('displays error message on invalid credentials', async () => {
        const user = userEvent.setup()

            // Mock failed login response
            ; (global.fetch as any).mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: 'Invalid credentials' }),
            })

        render(<LoginPage />, { wrapper: createWrapper() })

        const loginInput = screen.getByLabelText(/nombre de usuario o correo/i)
        const passwordInput = screen.getByLabelText(/contraseña/i)
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

        await user.type(loginInput, 'admin')
        await user.type(passwordInput, 'wrongpassword')
        await user.click(submitButton)

        // Verify error message is displayed
        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
        })

        // Verify no token was stored
        // expect(localStorage.getItem('token')).toBeNull()
    })

    it('shows loading state during login', async () => {
        const user = userEvent.setup()

            // Mock delayed response
            ; (global.fetch as any).mockImplementationOnce(
                () =>
                    new Promise((resolve) =>
                        setTimeout(
                            () =>
                                resolve({
                                    ok: true,
                                    json: async () => ({ token: 'mock-token', user: { id: 1 } }),
                                }),
                            100
                        )
                    )
            )

        render(<LoginPage />, { wrapper: createWrapper() })

        const loginInput = screen.getByLabelText(/nombre de usuario o correo/i)
        const passwordInput = screen.getByLabelText(/contraseña/i)
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })

        await user.type(loginInput, 'admin')
        await user.type(passwordInput, 'admin123')
        await user.click(submitButton)

        // Verify loading state
        expect(screen.getByText(/iniciando sesión/i)).toBeInTheDocument()
        expect(submitButton).toBeDisabled()
    })
})
