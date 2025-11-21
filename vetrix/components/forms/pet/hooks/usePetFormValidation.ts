"use client"

import { useCallback } from "react"
import type { PetFormData, PetFormErrors } from "../types/PetForm.types"
import { validatePetForm, validatePetBasicInfo, petBasicInfoSchema } from "../types/validation.schemas"

interface UsePetFormValidationReturn {
  validateForm: (data: PetFormData) => { success: boolean; errors: PetFormErrors }
  validateField: (field: keyof PetFormData, value: unknown) => { success: boolean; error?: string }
  validateSection: (section: keyof PetFormData[]) => { success: boolean; errors: PetFormErrors }
}

export function usePetFormValidation(): UsePetFormValidationReturn {
  // Validate entire form
  const validateForm = useCallback((data: PetFormData): { success: boolean; errors: PetFormErrors } => {
    const result = validatePetForm(data)
    
    if (result.success) {
      return { success: true, errors: {} }
    }

    const errors: PetFormErrors = {}
    result.error.errors.forEach((error) => {
      const path = error.path.join('.') as keyof PetFormData
      errors[path] = error.message
    })

    return { success: false, errors }
  }, [])

  // Validate individual field
  const validateField = useCallback((field: keyof PetFormData, value: unknown): { success: boolean; error?: string } => {
    // Create a mock object with just the field being validated
    const mockData = { [field]: value }
    
    try {
      // For basic info fields, use the basic info schema
      const basicInfoFields: (keyof PetFormData)[] = [
        'petNumber', 'ownerId', 'name', 'speciesId', 'breedId', 'sexId', 
        'primaryColorId', 'secondaryColorId'
      ]
      
      if (basicInfoFields.includes(field)) {
        const result = petBasicInfoSchema.pick({ [field]: true }).safeParse(mockData)
        if (!result.success) {
          return { 
            success: false, 
            error: result.error.errors[0]?.message || `Invalid ${field}` 
          }
        }
      }
      
      // Add validation for other field types as needed
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: `Validation error for ${field}` 
      }
    }
  }, [])

  // Validate form section
  const validateSection = useCallback((section: (keyof PetFormData)[]): { success: boolean; errors: PetFormErrors } => {
    // This would validate a specific section of the form
    // Implementation depends on section-specific schemas
    return { success: true, errors: {} }
  }, [])

  return {
    validateForm,
    validateField,
    validateSection
  }
}