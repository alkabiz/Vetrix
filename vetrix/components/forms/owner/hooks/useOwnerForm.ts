import { useState, useEffect, useCallback, useRef } from "react"
import { FormData, Owner, Option } from "../types/types"
import { validationSchema, formatPhoneNumber, validateForm } from "../types/validation"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const useOwnerForm = (owner: Owner | null | undefined, open: boolean) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phonePrimary: "",
    phoneSecondary: "",
    email: "",
    addressStreet: "",
    cityId: "",
    addressPostalCode: "",
    dateOfBirth: "",
    identificationTypeId: "",
    identificationNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    marketingConsent: false,
    dataProcessingConsent: true,
    isActive: true,
    creditLimit: "0",
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cities, setCities] = useState<Option[]>([])
  const [identificationTypes, setIdentificationTypes] = useState<Option[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)
  const [submitError, setSubmitError] = useState<string>("")

  // Initialize form data
  useEffect(() => {
    if (owner && open) {
      setFormData({
        firstName: owner.firstName || "",
        lastName: owner.lastName || "",
        phonePrimary: owner.phonePrimary || "",
        phoneSecondary: owner.phoneSecondary || "",
        email: owner.email || "",
        addressStreet: owner.addressStreet || "",
        cityId: owner.cityId ? String(owner.cityId) : "",
        addressPostalCode: owner.addressPostalCode || "",
        dateOfBirth: owner.dateOfBirth ? new Date(owner.dateOfBirth).toISOString().split("T")[0] : "",
        identificationTypeId: owner.identificationTypeId ? String(owner.identificationTypeId) : "",
        identificationNumber: owner.identificationNumber || "",
        emergencyContactName: owner.emergencyContactName || "",
        emergencyContactPhone: owner.emergencyContactPhone || "",
        emergencyContactRelationship: owner.emergencyContactRelationship || "",
        marketingConsent: owner.marketingConsent,
        dataProcessingConsent: owner.dataProcessingConsent,
        isActive: owner.isActive,
        creditLimit: String(owner.creditLimit || 0),
        notes: owner.notes || "",
      })
    } else if (open) {
      setFormData({
        firstName: "",
        lastName: "",
        phonePrimary: "",
        phoneSecondary: "",
        email: "",
        addressStreet: "",
        cityId: "",
        addressPostalCode: "",
        dateOfBirth: "",
        identificationTypeId: "",
        identificationNumber: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",
        marketingConsent: false,
        dataProcessingConsent: true,
        isActive: true,
        creditLimit: "0",
        notes: "",
      })
      setErrors({})
      setSubmitError("")
    }
  }, [owner, open])

  // Fetch dynamic options
  useEffect(() => {
    const fetchOptions = async () => {
      if (!open) return
      
      setIsLoadingOptions(true)
      try {
        const [citiesRes, idTypesRes] = await Promise.all([
          fetch('/api/cities'),
          fetch('/api/identification-types')
        ])
        
        if (citiesRes.ok) setCities(await citiesRes.json())
        if (idTypesRes.ok) setIdentificationTypes(await idTypesRes.json())
      } catch (error) {
        console.error("Failed to fetch options:", error)
        // Fallback options
        setCities([
          { id: 1, name: "Bogotá" }, { id: 2, name: "Medellín" },
          { id: 3, name: "Cali" }, { id: 4, name: "Barranquilla" }
        ])
        setIdentificationTypes([
          { id: 1, name: "Cédula de Ciudadanía (CC)" },
          { id: 2, name: "Cédula de Extranjería (CE)" },
          { id: 3, name: "Tarjeta de Identidad (TI)" },
          { id: 4, name: "Pasaporte" }
        ])
      } finally {
        setIsLoadingOptions(false)
      }
    }

    fetchOptions()
  }, [open])

  // Field validation
  const validateField = useCallback((field: string, value: string) => {
    const validator = validationSchema[field as keyof typeof validationSchema]
    if (validator) {
      const result = validator(value)
      if (typeof result === "string") {
        setErrors(prev => ({ ...prev, [field]: result }))
      } else {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    }
  }, [])

  // Debounced validation - FIXED: using useRef correctly
  const debouncedValidation = useRef(
    debounce((field: string, value: string) => {
      validateField(field, value)
    }, 300)
  ).current

  // Handlers
  const handleInputChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (typeof value === "string") debouncedValidation(field, value)
  }, [debouncedValidation])

  const handlePhoneChange = useCallback((field: 'phonePrimary' | 'phoneSecondary' | 'emergencyContactPhone', value: string) => {
    const formatted = formatPhoneNumber(value)
    setFormData(prev => ({ ...prev, [field]: formatted }))
    debouncedValidation(field, formatted)
  }, [debouncedValidation])

  const handleSelectChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const prepareSubmitData = useCallback(() => {
    return {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phonePrimary: formData.phonePrimary || undefined,
      phoneSecondary: formData.phoneSecondary || undefined,
      email: formData.email || undefined,
      addressStreet: formData.addressStreet || undefined,
      cityId: formData.cityId ? Number(formData.cityId) : undefined,
      addressPostalCode: formData.addressPostalCode || undefined,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
      identificationTypeId: formData.identificationTypeId ? Number(formData.identificationTypeId) : undefined,
      identificationNumber: formData.identificationNumber || undefined,
      emergencyContactName: formData.emergencyContactName || undefined,
      emergencyContactPhone: formData.emergencyContactPhone || undefined,
      emergencyContactRelationship: formData.emergencyContactRelationship || undefined,
      marketingConsent: formData.marketingConsent,
      dataProcessingConsent: formData.dataProcessingConsent,
      isActive: formData.isActive,
      creditLimit: Number(formData.creditLimit),
      notes: formData.notes || undefined,
    }
  }, [formData])

  return {
    formData,
    errors,
    isSubmitting,
    submitError,
    cities,
    identificationTypes,
    isLoadingOptions,
    handleInputChange,
    handlePhoneChange,
    handleSelectChange,
    validateForm: () => validateForm(formData),
    setErrors,
    setIsSubmitting,
    setSubmitError,
    prepareSubmitData,
  }
}