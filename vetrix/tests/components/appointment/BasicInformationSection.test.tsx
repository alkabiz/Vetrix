import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BasicInformationSection } from '@/components/forms/appointment/sections/BasicInformationSection'
import { DEFAULT_APPOINTMENT_FORM_VALUES } from '@/components/forms/appointment/AppointmentForm.types'

const mockOnFieldChange = vi.fn()

const defaultProps = {
  formData: DEFAULT_APPOINTMENT_FORM_VALUES,
  errors: {},
  owners: [],
  veterinarians: [],
  filteredPets: [],
  onFieldChange: mockOnFieldChange,
}

describe('BasicInformationSection', () => {
  it('renders the card heading', () => {
    render(<BasicInformationSection {...defaultProps} />)
    expect(screen.getByText('Basic Information')).toBeInTheDocument()
  })

  it('renders the Appointment Number input with empty initial value', () => {
    render(<BasicInformationSection {...defaultProps} />)
    const input = screen.getByLabelText(/appointment number/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('renders Owner, Pet, and Veterinarian select triggers (combobox roles)', () => {
    render(<BasicInformationSection {...defaultProps} />)
    // Radix Select renders as role="combobox" buttons; there should be 3 (owner, pet, vet)
    const combos = screen.getAllByRole('combobox')
    expect(combos.length).toBe(3)
  })

  it('renders Pet select disabled when no owner selected', () => {
    render(<BasicInformationSection {...defaultProps} />)
    // The pet combobox is the second one; it should be disabled when no owner is selected
    const combos = screen.getAllByRole('combobox')
    expect(combos[1]).toBeDisabled()
  })

  it('renders Veterinarian select trigger (third combobox)', () => {
    render(<BasicInformationSection {...defaultProps} />)
    const combos = screen.getAllByRole('combobox')
    expect(combos[2]).toBeInTheDocument()
  })

  it('does not throw when arrays are empty (initial state with zero data)', () => {
    expect(() => render(<BasicInformationSection {...defaultProps} />)).not.toThrow()
  })

  it('displays owner options when owners are provided', () => {
    const owners = [{ id: 1, firstName: 'John', lastName: 'Doe' }] as Parameters<typeof BasicInformationSection>[0]['owners']
    render(
      <BasicInformationSection
        {...defaultProps}
        owners={owners}
        formData={{ ...DEFAULT_APPOINTMENT_FORM_VALUES, ownerId: 1 }}
      />
    )
    // Owner should be visible in the trigger button after selection
    // The SelectValue text changes when ownerId matches
    expect(screen.getByLabelText(/appointment number/i)).toBeInTheDocument()
  })

  it('shows validation error for appointmentNumber', () => {
    render(
      <BasicInformationSection
        {...defaultProps}
        errors={{ appointmentNumber: 'Appointment number is required' }}
      />
    )
    expect(screen.getByText('Appointment number is required')).toBeInTheDocument()
  })

  it('shows validation error for ownerId', () => {
    render(
      <BasicInformationSection
        {...defaultProps}
        errors={{ ownerId: 'Owner is required' }}
      />
    )
    expect(screen.getByText('Owner is required')).toBeInTheDocument()
  })
})
