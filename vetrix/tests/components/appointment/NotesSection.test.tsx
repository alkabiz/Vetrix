import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NotesSection } from '@/components/forms/appointment/sections/NotesSection'
import { DEFAULT_APPOINTMENT_FORM_VALUES } from '@/components/forms/appointment/AppointmentForm.types'

const mockOnFieldChange = vi.fn()

describe('NotesSection', () => {
  const defaultProps = {
    formData: DEFAULT_APPOINTMENT_FORM_VALUES,
    onFieldChange: mockOnFieldChange,
  }

  it('renders the card heading', () => {
    render(<NotesSection {...defaultProps} />)
    expect(screen.getByText('Notes')).toBeInTheDocument()
  })

  it('renders the Public Notes textarea with empty initial value', () => {
    render(<NotesSection {...defaultProps} />)
    const textarea = screen.getByLabelText(/public notes/i)
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveValue('')
  })

  it('renders the Internal Notes textarea with empty initial value', () => {
    render(<NotesSection {...defaultProps} />)
    const textarea = screen.getByLabelText(/internal notes/i)
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveValue('')
  })

  it('does not throw when notes/internalNotes are empty strings', () => {
    expect(() => render(<NotesSection {...defaultProps} />)).not.toThrow()
  })

  it('displays provided notes values', () => {
    render(
      <NotesSection
        formData={{ ...DEFAULT_APPOINTMENT_FORM_VALUES, notes: 'Staff note', internalNotes: 'Private note' }}
        onFieldChange={mockOnFieldChange}
      />
    )
    expect(screen.getByDisplayValue('Staff note')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Private note')).toBeInTheDocument()
  })
})
