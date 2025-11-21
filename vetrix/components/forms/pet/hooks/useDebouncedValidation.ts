import { useState, useEffect, useRef, useCallback } from 'react'

interface UseDebouncedValidationProps {
  value: string
  validateFunction: (value: string) => Promise<string | null> | string | null
  delay?: number
  immediate?: boolean
}

export function useDebouncedValidation({
  value,
  validateFunction,
  delay = 500,
  immediate = false
}: UseDebouncedValidationProps) {
  const [error, setError] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const validate = useCallback(async (val: string) => {
    if (!mountedRef.current) return

    setIsValidating(true)
    try {
      const result = await validateFunction(val)
      if (mountedRef.current) {
        setError(result)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Validation failed')
      }
    } finally {
      if (mountedRef.current) {
        setIsValidating(false)
      }
    }
  }, [validateFunction])

  useEffect(() => {
    if (immediate || value.length > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        validate(value)
      }, delay)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, validate, delay, immediate])

  return {
    error,
    isValidating,
    triggerValidation: () => validate(value)
  }
}

export function useMicrochipValidation(microchipNumber: string) {
  return useDebouncedValidation({
    value: microchipNumber,
    validateFunction: async (value: string) => {
      if (!value) return null
      
      if (!/^[0-9A-F]{15}$/i.test(value)) {
        return "Microchip must be 15-digit hexadecimal format"
      }
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const isUnique = Math.random() > 0.5
      
      if (!isUnique) {
        return "This microchip number is already registered"
      }
      
      return null
    },
    delay: 600
  })
}

export function usePetNumberValidation(petNumber: string) {
  return useDebouncedValidation({
    value: petNumber,
    validateFunction: async (value: string) => {
      if (!value) return "Pet number is required"
      
      if (!/^PET[A-Z0-9]+$/.test(value)) {
        return "Pet number must start with PET followed by alphanumeric characters"
      }
      
      await new Promise(resolve => setTimeout(resolve, 300))
      const isUnique = Math.random() > 0.7
      
      if (!isUnique) {
        return "This pet number is already in use"
      }
      
      return null
    },
    delay: 400
  })
}