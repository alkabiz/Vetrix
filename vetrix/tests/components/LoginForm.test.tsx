
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '@/src/components/LoginForm'
import userEvent from '@testing-library/user-event'

describe('LoginForm Component', () => {
    const mockSubmit = vi.fn()

    const setup = () => {
        return {
            user: userEvent.setup(),
            ...render(<LoginForm onSubmit={mockSubmit} isLoading={false} error={null} />)
        }
    }

    it('should render login form fields', () => {
        setup()
        expect(screen.getByRole('textbox', { name: /usuario o email/i })).toBeInTheDocument()
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument()
    })

    it('should show validation errors for empty fields', async () => {
        const { user } = setup()
        
        // Click submit without filling fields
        await user.click(screen.getByRole('button', { name: /ingresar/i }))

        await waitFor(() => {
            expect(screen.getByText(/el usuario o correo es requerido/i)).toBeInTheDocument()
            expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument()
        })
    })

    it('should call onSubmit with correct data when form is valid', async () => {
        const { user } = setup()

        await user.type(screen.getByRole('textbox', { name: /usuario o email/i }), 'testuser')
        await user.type(screen.getByLabelText(/contraseña/i), 'password123')
        
        await user.click(screen.getByRole('button', { name: /ingresar/i }))

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith({
                login: 'testuser',
                password: 'password123'
            })
        })
    })

    it('should show error message from props', () => {
        render(<LoginForm onSubmit={mockSubmit} isLoading={false} error="Invalid credentials" />)
        expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
    })

    it('should disable button when loading', () => {
        render(<LoginForm onSubmit={mockSubmit} isLoading={true} error={null} />)
        expect(screen.getByRole('button')).toBeDisabled()
        expect(screen.getByText(/ingresando.../i)).toBeInTheDocument()
    })
})
