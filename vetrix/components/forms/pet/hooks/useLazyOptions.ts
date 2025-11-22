import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook for lazy loading options with debouncing
 */
export function useLazyOptions<T>(
  fetchFunction: (query?: string) => Promise<T[]>,
  delay: number = 500,
  immediate: boolean = false
) {
  const [options, setOptions] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const abortControllerRef = useRef<AbortController>()

  const loadOptions = useCallback(async (query?: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchFunction(query)
      if (!abortControllerRef.current.signal.aborted) {
        setOptions(data)
      }
    } catch (err) {
      if (!abortControllerRef.current.signal.aborted) {
        setError(err instanceof Error ? err.message : 'Failed to load options')
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [fetchFunction])

  const debouncedLoadOptions = useCallback((query?: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      loadOptions(query)
    }, delay)
  }, [loadOptions, delay])

  // Load options immediately if needed
  useEffect(() => {
    if (immediate) {
      loadOptions()
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [immediate, loadOptions])

  return {
    options,
    isLoading,
    error,
    loadOptions: debouncedLoadOptions,
    reloadOptions: () => loadOptions()
  }
}

/**
 * Hook for breed options that loads only when species is selected
 */
export function useLazyBreeds<T = unknown>(
  speciesId: number | "",
  fetchBreeds: (speciesId: number) => Promise<T[]>
) {
  const [breeds, setBreeds] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const loadedSpeciesRef = useRef<number | "">("")
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Cleanup previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    if (!speciesId) {
      setBreeds([])
      loadedSpeciesRef.current = ""
      return
    }

    if (speciesId === loadedSpeciesRef.current) {
      return
    }

    const loadBreeds = async () => {
      abortControllerRef.current = new AbortController()
      setIsLoading(true)
      setError(null)

      try {
        const breedData = await fetchBreeds(speciesId)

        if (!abortControllerRef.current?.signal.aborted) {
          setBreeds(breedData)
          loadedSpeciesRef.current = speciesId
        }
      } catch (err) {
        if (!abortControllerRef.current?.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Failed to load breeds')
        }
      } finally {
        if (!abortControllerRef.current?.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadBreeds()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [speciesId, fetchBreeds])

  return {
    breeds,
    isLoading,
    error
  }
}