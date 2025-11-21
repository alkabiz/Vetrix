import type { 
  Appointment, 
  Owner, 
  Pet, 
  Veterinarian, 
  AppointmentStatus, 
  AppointmentType, 
  AppointmentPriority 
} from "@/lib/database/database"

// Base form data interface with proper typing
export interface AppointmentFormData {
  appointmentNumber: string
  petId: number | ""
  ownerId: number | ""
  veterinarianId: number | ""
  appointmentDatetime: string
  durationMinutes: number
  statusId: number
  typeId: number
  priorityId: number
  reason: string
  isFollowUp: boolean
  parentAppointmentId: number | ""
  petConditionOnArrival: string
  reminderSent: boolean
  confirmationRequired: boolean
  isConfirmed: boolean
  followUpRequired: boolean
  followUpDate: string
  followUpReason: string
  estimatedCost: number | ""
  actualCost: number | ""
  notes: string
  internalNotes: string
}

// Form validation errors
export interface AppointmentFormErrors {
  appointmentNumber?: string
  ownerId?: string
  petId?: string
  appointmentDatetime?: string
  reason?: string
  durationMinutes?: string
  estimatedCost?: string
  actualCost?: string
  submit?: string
  [key: string]: string | undefined
}

// Props for the main component
export interface AppointmentFormProps {
  appointment?: Appointment | null
  owners: Owner[]
  pets: Pet[]
  veterinarians: Veterinarian[]
  statusOptions: AppointmentStatus[]
  typeOptions: AppointmentType[]
  priorityOptions: AppointmentPriority[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => Promise<void>
}

// Props for sub-components
export interface BasicInformationSectionProps {
  formData: AppointmentFormData
  errors: AppointmentFormErrors
  owners: Owner[]
  pets: Pet[]
  veterinarians: Veterinarian[]
  filteredPets: Pet[]
  onFieldChange: <K extends keyof AppointmentFormData>(
    field: K, 
    value: AppointmentFormData[K]
  ) => void
  disabled?: boolean
}

export interface SchedulingSectionProps {
  formData: AppointmentFormData
  errors: AppointmentFormErrors
  statusOptions: AppointmentStatus[]
  typeOptions: AppointmentType[]
  priorityOptions: AppointmentPriority[]
  onFieldChange: <K extends keyof AppointmentFormData>(
    field: K, 
    value: AppointmentFormData[K]
  ) => void
}

export interface AppointmentDetailsSectionProps {
  formData: AppointmentFormData
  errors: AppointmentFormErrors
  onFieldChange: <K extends keyof AppointmentFormData>(
    field: K, 
    value: AppointmentFormData[K]
  ) => void
}

export interface FollowUpSectionProps {
  formData: AppointmentFormData
  onFieldChange: <K extends keyof AppointmentFormData>(
    field: K, 
    value: AppointmentFormData[K]
  ) => void
}

export interface NotesSectionProps {
  formData: AppointmentFormData
  onFieldChange: <K extends keyof AppointmentFormData>(
    field: K, 
    value: AppointmentFormData[K]
  ) => void
}

// Form submission types
export interface AppointmentSubmitData 
  extends Omit<Appointment, "id" | "createdAt" | "updatedAt" | "appointmentDate"> {
  appointmentDate: string
}

// Validation schema type (for Zod or Yup)
export interface AppointmentFormValidationSchema {
  appointmentNumber: string
  ownerId: number
  petId: number
  appointmentDatetime: Date
  durationMinutes: number
  statusId: number
  typeId: number
  priorityId: number
  reason: string
  isFollowUp: boolean
  parentAppointmentId?: number
  estimatedCost?: number
  actualCost?: number
}

// API response types
export interface AppointmentFormApiResponse {
  success: boolean
  data?: Appointment
  error?: string
  validationErrors?: Record<string, string>
}

// Hook return types
export interface UseAppointmentFormReturn {
  formData: AppointmentFormData
  errors: AppointmentFormErrors
  isSubmitting: boolean
  filteredPets: Pet[]
  handleFieldChange: <K extends keyof AppointmentFormData>(
    field: K, 
    value: AppointmentFormData[K]
  ) => void
  handleNumberFieldChange: (field: keyof AppointmentFormData, value: string) => void
  validateForm: () => boolean
  resetForm: () => void
}

// Default values constant type
export type AppointmentFormDefaultValues = Omit<
  AppointmentFormData, 
  'appointmentNumber' | 'appointmentDatetime'
> & {
  appointmentNumber?: string
  appointmentDatetime?: string
}

// Utility types for form operations
export type FormField = keyof AppointmentFormData
export type NumberField = {
  [K in keyof AppointmentFormData]: AppointmentFormData[K] extends number | "" ? K : never
}[keyof AppointmentFormData]

export type BooleanField = {
  [K in keyof AppointmentFormData]: AppointmentFormData[K] extends boolean ? K : never
}[keyof AppointmentFormData]

export type StringField = {
  [K in keyof AppointmentFormData]: AppointmentFormData[K] extends string ? K : never
}[keyof AppointmentFormData]

// Event handler types
export interface AppointmentFormEventHandlers {
  onSubmit: (data: AppointmentSubmitData) => Promise<void>
  onCancel: () => void
  onFieldChange: <K extends keyof AppointmentFormData>(
    field: K, 
    value: AppointmentFormData[K]
  ) => void
  onValidate: (field: keyof AppointmentFormData) => string | undefined
}

// Configuration type for form behavior
export interface AppointmentFormConfig {
  autoGenerateAppointmentNumber: boolean
  allowPastAppointments: boolean
  requireVeterinarianAssignment: boolean
  defaultDuration: number
  minDuration: number
  maxDuration: number
  enableReminderSystem: boolean
  enableCostTracking: boolean
}

// Export a union type for all form-related types
export type AppointmentFormTypes = 
  | AppointmentFormData
  | AppointmentFormErrors
  | AppointmentFormProps
  | AppointmentSubmitData

// Constants for form configuration
export const APPOINTMENT_FORM_CONFIG: AppointmentFormConfig = {
  autoGenerateAppointmentNumber: true,
  allowPastAppointments: false,
  requireVeterinarianAssignment: false,
  defaultDuration: 30,
  minDuration: 15,
  maxDuration: 240,
  enableReminderSystem: true,
  enableCostTracking: true,
} as const

export const DURATION_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
] as const

// Default form values
export const DEFAULT_APPOINTMENT_FORM_VALUES: AppointmentFormData = {
  appointmentNumber: "",
  petId: "",
  ownerId: "",
  veterinarianId: "",
  appointmentDatetime: "",
  durationMinutes: 30,
  statusId: 1,
  typeId: 1,
  priorityId: 2,
  reason: "",
  isFollowUp: false,
  parentAppointmentId: "",
  petConditionOnArrival: "",
  reminderSent: false,
  confirmationRequired: true,
  isConfirmed: false,
  followUpRequired: false,
  followUpDate: "",
  followUpReason: "",
  estimatedCost: "",
  actualCost: "",
  notes: "",
  internalNotes: "",
}