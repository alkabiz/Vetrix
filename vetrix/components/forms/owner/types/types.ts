export interface Owner {
  id: number
  firstName: string
  lastName: string
  phonePrimary?: string
  phoneSecondary?: string
  email?: string
  addressStreet?: string
  cityId?: number
  addressPostalCode?: string
  dateOfBirth?: Date
  identificationTypeId?: number
  identificationNumber?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelationship?: string
  marketingConsent: boolean
  dataProcessingConsent: boolean
  isActive: boolean
  creditLimit: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface FormData {
  firstName: string
  lastName: string
  phonePrimary: string
  phoneSecondary: string
  email: string
  addressStreet: string
  cityId: string
  addressPostalCode: string
  dateOfBirth: string
  identificationTypeId: string
  identificationNumber: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  marketingConsent: boolean
  dataProcessingConsent: boolean
  isActive: boolean
  creditLimit: string
  notes: string
}

export interface FormDataType {
  firstName: string;
  lastName: string;
  email?: string;
  phonePrimary?: string;
  phoneSecondary?: string;
  emergencyContactPhone?: string;
  creditLimit?: string;
  identificationNumber?: string;
  dataProcessingConsent: boolean;
}

export interface Option {
  id: number
  name: string
}

export interface OwnerFormProps {
  owner?: Owner | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (owner: Omit<Owner, "id" | "createdAt" | "updatedAt">) => Promise<void>
}

export interface FormHandlers {
  handleInputChange: (field: keyof FormData, value: string | boolean) => void
  handlePhoneChange: (field: 'phonePrimary' | 'phoneSecondary' | 'emergencyContactPhone', value: string) => void
  handleSelectChange: (field: keyof FormData, value: string) => void
}

export interface FormState {
  formData: FormData
  errors: Record<string, string>
  isSubmitting: boolean
  submitError: string
  cities: Option[]
  identificationTypes: Option[]
  isLoadingOptions: boolean
}