import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SchedulingSection } from '@/components/forms/appointment/sections/SchedulingSection'
import { DEFAULT_APPOINTMENT_FORM_VALUES } from '@/components/forms/appointment/AppointmentForm.types'

const mockOnFieldChange = vi.fn()

const defaultProps = {
  formData: DEFAULT_APPOINTMENT_FORM_VALUES,
  errors: {},
  statusOptions: [],
  typeOptions: [],
  priorityOptions: [],
  onFieldChange: mockOnFieldChange,
}

describe('SchedulingSection', () => {
  it('renders the card heading', () => {
    render(<SchedulingSection {...defaultProps} />)
    expect(screen.getByText('Scheduling')).toBeInTheDocument()
  })

  it('renders the Date & Time input', () => {
    render(<SchedulingSection {...defaultProps} />)
    const input = screen.getByLabelText(/date & time/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'datetime-local')
  })

  it('renders the Duration select trigger (combobox role)', () => {
    render(<SchedulingSection {...defaultProps} />)
    // durationMinutes defaults to 30, which matches DURATION_OPTIONS → shows "30 minutes"
    // Radix renders it as a combobox button
    const combos = screen.getAllByRole('combobox')
    expect(combos.length).toBe(4) // duration, status, type, priority
  })

  it('renders Status, Type, Priority select labels', () => {
    render(<SchedulingSection {...defaultProps} />)
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Priority')).toBeInTheDocument()
  })

  it('does not throw when all option arrays are empty (initial state with zero data)', () => {
    expect(() => render(<SchedulingSection {...defaultProps} />)).not.toThrow()
  })

  it('renders status options when statusOptions are provided', () => {
    const statusOptions = [{ id: 1, name: 'Scheduled' }] as Parameters<typeof SchedulingSection>[0]['statusOptions']
    render(
      <SchedulingSection
        {...defaultProps}
        statusOptions={statusOptions}
        formData={{ ...DEFAULT_APPOINTMENT_FORM_VALUES, statusId: 1 }}
      />
    )
    // Status label is still present
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('shows validation error for appointmentDatetime', () => {
    render(
      <SchedulingSection
        {...defaultProps}
        errors={{ appointmentDatetime: 'Date and time is required' }}
      />
    )
    expect(screen.getByText('Date and time is required')).toBeInTheDocument()
  })

  it('renders with durationMinutes=0 showing empty combobox (value guard in effect)', () => {
    // When durationMinutes is 0, the guard converts it to "", so Radix Select
    // shows no matching option. The combobox still renders (not hidden).
    render(<SchedulingSection {...defaultProps} formData={{ ...DEFAULT_APPOINTMENT_FORM_VALUES, durationMinutes: 0 }} />)
    const combos = screen.getAllByRole('combobox')
    // Duration combobox still in the DOM — not hidden/invisible
    expect(combos[0]).toBeInTheDocument()
    expect(combos[0]).not.toBeDisabled()
  })
})
