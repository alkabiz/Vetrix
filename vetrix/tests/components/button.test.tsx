import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
    it('renders button with text', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
    })

    it('handles click events', async () => {
        let clicked = false
        const handleClick = () => {
            clicked = true
        }

        render(<Button onClick={handleClick}>Click me</Button>)
        const button = screen.getByRole('button', { name: /click me/i })
        button.click()

        expect(clicked).toBe(true)
    })

    it('can be disabled', () => {
        render(<Button disabled>Disabled</Button>)
        const button = screen.getByRole('button', { name: /disabled/i })
        expect(button).toBeDisabled()
    })

    it('applies variant styles', () => {
        const { container } = render(<Button variant="destructive">Delete</Button>)
        const button = container.querySelector('button')
        expect(button).toHaveClass('bg-destructive')
    })
})
