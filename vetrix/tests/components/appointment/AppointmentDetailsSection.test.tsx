import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppointmentDetailsSection } from '@/components/forms/appointment/sections/AppointmentDetailsSection'
import { DEFAULT_APPOINTMENT_FORM_VALUES } from '@/components/forms/appointment/AppointmentForm.types'

const mockOnFieldChange = vi.fn()

describe('AppointmentDetailsSection', () => {
  const defaultProps = {
    formData: DEFAULT_APPOINTMENT_FORM_VALUES,
    errors: {},
    onFieldChange: mockOnFieldChange,
  }

  it('renders the card heading', () => {
    render(<AppointmentDetailsSection {...defaultProps} />)
    expect(screen.getByText('Appointment Details')).toBeInTheDocument()
  })

  it('renders the Reason for Visit textarea with empty initial value', () => {
    render(<AppointmentDetailsSection {...defaultProps} />)
    const textarea = screen.getByLabelText(/reason for visit/i)
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveValue('')
  })

  it('renders the Pet Condition textarea with empty initial value', () => {
    render(<AppointmentDetailsSection {...defaultProps} />)
    const textarea = screen.getByLabelText(/pet condition on arrival/i)
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveValue('')
  })

  it('renders cost inputs when enableCostTracking is true', () => {
    render(<AppointmentDetailsSection {...defaultProps} />)
    // APPOINTMENT_FORM_CONFIG.enableCostTracking is true by default
    expect(screen.getByLabelText(/estimated cost/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/actual cost/i)).toBeInTheDocument()
  })

  it('shows validation error message for reason field', () => {
    render(
      <AppointmentDetailsSection
        {...defaultProps}
        errors={{ reason: 'Reason for visit is required' }}
      />
    )
    expect(screen.getByText('Reason for visit is required')).toBeInTheDocument()
  })

  it('does not throw when formData fields are empty strings (initial state)', () => {
    expect(() =>
      render(<AppointmentDetailsSection {...defaultProps} />)
    ).not.toThrow()
  })

  it('renders correctly with null-safe formData (simulates API null values)', () => {
    const nullishFormData = {
      ...DEFAULT_APPOINTMENT_FORM_VALUES,
      reason: '' as string,
      petConditionOnArrival: '' as string,
      estimatedCost: '' as '' | number,
      actualCost: '' as '' | number,
    }
    expect(() =>
      render(
        <AppointmentDetailsSection
          formData={nullishFormData}
          errors={{}}
          onFieldChange={mockOnFieldChange}
        />
      )
    ).not.toThrow()
  })
})
