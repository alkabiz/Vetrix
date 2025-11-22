"use client"

import { useReducer, useCallback, useEffect, useRef } from "react"
import type { Pet } from "@/lib/database/database"
import type { UsePetFormProps, UsePetFormReturn, PetFormData, PetFormErrors } from "../types/PetForm.types"
import { DEFAULT_PET_FORM_VALUES } from "../types/form-data.types"
import { usePetFormValidation } from "./usePetFormValidation"
import { transformFormDataToPet, transformPetToFormData } from "../utils/data-transformers"

interface PetFormState {
  formData: PetFormData
  errors: PetFormErrors
  isSubmitting: boolean
  isDirty: boolean
  originalData: PetFormData | null
}

type PetFormAction =
  | { type: 'SET_FIELD'; field: keyof PetFormData; value: unknown }
  | { type: 'SET_ERRORS'; errors: PetFormErrors }
  | { type: 'SET_SUBMITTING'; isSubmitting: boolean }
  | { type: 'RESET_FORM'; initialData?: PetFormData }
  | { type: 'MARK_DIRTY' }

function petFormReducer(state: PetFormState, action: PetFormAction): PetFormState {
  switch (action.type) {
    case 'SET_FIELD':
      const newFormData = { ...state.formData, [action.field]: action.value }
      const isDirty = state.originalData
        ? JSON.stringify(newFormData) !== JSON.stringify(state.originalData)
        : true

      return {
        ...state,
        formData: newFormData,
        isDirty,
        errors: { ...state.errors, [action.field]: undefined }
      }

    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors
      }

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.isSubmitting
      }

    case 'RESET_FORM':
      const initialData = action.initialData || DEFAULT_PET_FORM_VALUES
      return {
        formData: initialData,
        errors: {},
        isSubmitting: false,
        isDirty: false,
        originalData: initialData
      }

    case 'MARK_DIRTY':
      return {
        ...state,
        isDirty: true
      }

    default:
      return state
  }
}

function getInitialState(pet?: Pet | null): PetFormState {
  const initialFormData = pet
    ? transformPetToFormData(pet)
    : DEFAULT_PET_FORM_VALUES

  return {
    formData: initialFormData,
    errors: {},
    isSubmitting: false,
    isDirty: false,
    originalData: initialFormData
  }
}

export function usePetForm({ pet, onSubmit }: UsePetFormProps): UsePetFormReturn {
  const [state, dispatch] = useReducer(petFormReducer, getInitialState(pet))
  const { validateForm, validateField: validateFieldSchema } = usePetFormValidation()

  const onSubmitRef = useRef(onSubmit)
  onSubmitRef.current = onSubmit

  const handleFieldChange = useCallback(<K extends keyof PetFormData>(
    field: K,
    value: PetFormData[K]
  ) => {
    dispatch({ type: 'SET_FIELD', field, value })
  }, [])

  const validateField = useCallback((field: keyof PetFormData): boolean => {
    const result = validateFieldSchema(field, state.formData[field])

    if (!result.success) {
      dispatch({
        type: 'SET_ERRORS',
        errors: { ...state.errors, [field]: result.error }
      })
      return false
    }

    if (state.errors[field]) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [field]: _, ...restErrors } = state.errors
      dispatch({ type: 'SET_ERRORS', errors: restErrors })
    }

    return true
  }, [state.formData, state.errors, validateFieldSchema])

  const validateFormHandler = useCallback((): boolean => {
    const validationResult = validateForm(state.formData)

    if (!validationResult.success) {
      dispatch({ type: 'SET_ERRORS', errors: validationResult.errors })
      return false
    }

    dispatch({ type: 'SET_ERRORS', errors: {} })
    return true
  }, [state.formData, validateForm])

  const handleSubmit = useCallback(async (): Promise<void> => {
    dispatch({ type: 'SET_SUBMITTING', isSubmitting: true })

    try {
      if (!validateFormHandler()) {
        throw new Error("Form validation failed")
      }

      const petData = transformFormDataToPet(state.formData)
      await onSubmitRef.current(petData)

      dispatch({ type: 'RESET_FORM', initialData: state.formData })
    } catch (error) {
      console.error("Form submission error:", error)
      dispatch({
        type: 'SET_ERRORS',
        errors: {
          submit: error instanceof Error ? error.message : "Failed to submit form"
        }
      })
      throw error
    } finally {
      dispatch({ type: 'SET_SUBMITTING', isSubmitting: false })
    }
  }, [state.formData, validateFormHandler])

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM', initialData: getInitialState(pet).formData })
  }, [pet])

  const generatePetNumber = useCallback((): string => {
    return `PET${Date.now().toString().slice(-6)}`
  }, [])

  const initializeNewPet = useCallback(() => {
    const petNumber = generatePetNumber()
    const now = new Date().toISOString().split('T')[0]

    dispatch({
      type: 'SET_FIELD',
      field: 'petNumber',
      value: petNumber
    })
    dispatch({
      type: 'SET_FIELD',
      field: 'acquisitionDate',
      value: now
    })
  }, [generatePetNumber])

  useEffect(() => {
    if (!pet) {
      initializeNewPet()
    }
  }, [pet, initializeNewPet])

  useEffect(() => {
    if (state.formData.isSterilized) {
      validateField('sterilizationDate')
      validateField('sterilizationTypeId')
    }

    if (state.formData.microchipNumber) {
      validateField('microchipDate')
    }

    if (state.formData.dateOfDeath) {
      validateField('causeOfDeath')
    }
  }, [
    state.formData.isSterilized,
    state.formData.microchipNumber,
    state.formData.dateOfDeath,
    validateField
  ])

  return {
    formData: state.formData,
    errors: state.errors,
    isSubmitting: state.isSubmitting,
    isDirty: state.isDirty,
    handleFieldChange,
    handleSubmit,
    resetForm,
    validateForm: validateFormHandler,
    validateField
  }
}