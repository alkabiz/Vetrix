import { FormDataType } from "./types"

export const validationSchema = {
  firstName: (value: string) => {
    if (!value.trim()) return "First name is required"
    if (value.trim().length < 2) return "First name must be at least 2 characters"
    return true
  },
  lastName: (value: string) => {
    if (!value.trim()) return "Last name is required"
    if (value.trim().length < 2) return "Last name must be at least 2 characters"
    return true
  },
  email: (value: string) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format"
    return true
  },
  phonePrimary: (value: string) => {
    if (value && !/^[+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ""))) return "Invalid phone number format"
    return true
  },
  phoneSecondary: (value: string) => {
    if (value && !/^[+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ""))) return "Invalid phone number format"
    return true
  },
  emergencyContactPhone: (value: string) => {
    if (value && !/^[+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ""))) return "Invalid phone number format"
    return true
  },
  creditLimit: (value: string) => {
    if (isNaN(Number(value)) || Number(value) < 0) return "Credit limit must be a positive number"
    return true
  },
  identificationNumber: (value: string) => {
    if (value && value.length < 3) return "Identification number must be at least 3 characters"
    return true
  }
}

export const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const validateForm = (formData: FormDataType): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  Object.keys(validationSchema).forEach(field => {
    const validator = validationSchema[field as keyof typeof validationSchema]
    const value = formData[field as keyof FormDataType] as string
    const result = validator(value)
    if (typeof result === "string") {
      errors[field] = result
    }
  })

  // Check required fields
  if (!formData.firstName.trim()) errors.firstName = "First name is required"
  if (!formData.lastName.trim()) errors.lastName = "Last name is required"
  if (!formData.dataProcessingConsent) errors.dataProcessingConsent = "Data processing consent is required"

  return errors
}