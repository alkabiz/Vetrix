"use client"

import { useCallback } from "react"
import type { PetFormData, PetFormErrors } from "../types/PetForm.types"
import { petFormSchema, petFormBaseSchema } from "../types/validation.schemas"

interface UsePetFormValidationReturn {
  validateForm: (data: PetFormData) => { success: boolean; errors: PetFormErrors }
  validateField: (field: keyof PetFormData, value: unknown) => { success: boolean; error?: string }
  validateSection: (fields: (keyof PetFormData)[], data: PetFormData) => { success: boolean; errors: PetFormErrors }
}

export function usePetFormValidation(): UsePetFormValidationReturn {
  // Validate entire form
  const validateForm = useCallback((data: PetFormData): { success: boolean; errors: PetFormErrors } => {
    const result = petFormSchema.safeParse(data)

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
    try {
      // Create a schema that only validates the specific field
      // We use pick to extract just the field we want to validate
      const fieldSchema = petFormBaseSchema.pick({ [field]: true } as Record<keyof PetFormData, true>)
      const result = fieldSchema.safeParse({ [field]: value })

      if (!result.success) {
        return {
          success: false,
          error: result.error.errors[0]?.message || `Invalid ${field}`
        }
      }

      return { success: true }
    } catch (error) {
      console.error(`Validation error for ${field}:`, error)
      return {
        success: false,
        error: `Validation error for ${field}`
      }
    }
  }, [])

  // Validate form section (subset of fields)
  const validateSection = useCallback((fields: (keyof PetFormData)[], data: PetFormData): { success: boolean; errors: PetFormErrors } => {
    const errors: PetFormErrors = {}
    let isValid = true

    // Create a schema for the section by picking the fields
    const pickMask = fields.reduce((acc, field) => ({ ...acc, [field]: true }), {} as Record<keyof PetFormData, true>)
    const sectionSchema = petFormBaseSchema.pick(pickMask)

    const result = sectionSchema.safeParse(data)

    if (!result.success) {
      isValid = false
      result.error.errors.forEach((error) => {
        const path = error.path.join('.') as keyof PetFormData
        errors[path] = error.message
      })
    }

    return { success: isValid, errors }
  }, [])

  return {
    validateForm,
    validateField,
    validateSection
  }
}