"use client"

import { useCallback } from "react"
import type { PetFormData, PetFormErrors } from "../types/PetForm.types"
import { petFormSchema } from "../types/validation.schemas"

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