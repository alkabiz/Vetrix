import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FollowUpSection } from '@/components/forms/appointment/sections/FollowUpSection'
import { DEFAULT_APPOINTMENT_FORM_VALUES } from '@/components/forms/appointment/AppointmentForm.types'

const mockOnFieldChange = vi.fn()

describe('FollowUpSection', () => {
  const defaultProps = {
    formData: DEFAULT_APPOINTMENT_FORM_VALUES,
    onFieldChange: mockOnFieldChange,
  }

  it('renders the card heading', () => {
    render(<FollowUpSection {...defaultProps} />)
    expect(screen.getByText('Follow-up & Reminders')).toBeInTheDocument()
  })

  it('renders the "is follow-up" checkbox unchecked by default', () => {
    render(<FollowUpSection {...defaultProps} />)
    const checkbox = screen.getByRole('checkbox', { name: /this is a follow-up appointment/i })
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()
  })

  it('renders the "follow-up required" checkbox unchecked by default', () => {
    render(<FollowUpSection {...defaultProps} />)
    const checkbox = screen.getByRole('checkbox', { name: /follow-up required/i })
    expect(checkbox).not.toBeChecked()
  })

  it('renders confirmation and confirmation-required checkboxes when APPOINTMENT_FORM_CONFIG.enableReminderSystem is true', () => {
    render(<FollowUpSection {...defaultProps} />)
    // enableReminderSystem is true by default in APPOINTMENT_FORM_CONFIG
    expect(screen.getByRole('checkbox', { name: /confirmation required/i })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /appointment confirmed/i })).toBeInTheDocument()
  })

  it('does not render follow-up date/reason inputs when followUpRequired is false', () => {
    render(<FollowUpSection {...defaultProps} />)
    expect(screen.queryByLabelText(/follow-up date/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/follow-up reason/i)).not.toBeInTheDocument()
  })

  it('renders follow-up date and reason inputs when followUpRequired is true', () => {
    render(
      <FollowUpSection
        formData={{ ...DEFAULT_APPOINTMENT_FORM_VALUES, followUpRequired: true }}
        onFieldChange={mockOnFieldChange}
      />
    )
    expect(screen.getByLabelText(/follow-up date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/follow-up reason/i)).toBeInTheDocument()
  })

  it('does not throw with all default (zero/false/empty) initial values', () => {
    expect(() => render(<FollowUpSection {...defaultProps} />)).not.toThrow()
  })
})
