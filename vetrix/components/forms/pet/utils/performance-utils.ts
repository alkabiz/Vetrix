/**
 * Custom comparison functions for React.memo
 */

/**
 * Deep comparison of two values
 * Supports primitives, objects, arrays, and Dates
 */
export const deepEqual = (a: any, b: any): boolean => {
  // Primitives and reference equality
  if (a === b) return true

  // Null/Undefined checks
  if (a === null || b === null || a === undefined || b === undefined) {
    return a === b
  }

  // Date comparison
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  // Array comparison
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((val, index) => deepEqual(val, b[index]))
  }

  // Object comparison
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    return keysA.every(key => {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false
      return deepEqual(a[key], b[key])
    })
  }

  return false
}

// Generic shallow comparison for props
export const shallowCompareProps = <T extends Record<string, any>>(
  prevProps: T,
  nextProps: T
): boolean => {
  const prevKeys = Object.keys(prevProps)
  const nextKeys = Object.keys(nextProps)

  if (prevKeys.length !== nextKeys.length) return false

  return prevKeys.every(key => prevProps[key] === nextProps[key])
}

// Deep comparison for form data objects
export const deepCompareFormData = <T extends Record<string, any>>(
  prevProps: T,
  nextProps: T
): boolean => {
  return deepEqual(prevProps, nextProps)
}

// Section-specific comparison functions
export const createSectionPropsComparator = <T extends { formData: any; errors: any; disabled?: boolean }>(
  formDataKeys: readonly string[]
) => {
  return (prevProps: T, nextProps: T): boolean => {
    // Compare disabled state
    if (prevProps.disabled !== nextProps.disabled) return false

    // Compare relevant form data fields
    for (const key of formDataKeys) {
      if (prevProps.formData[key] !== nextProps.formData[key]) {
        return false
      }
    }

    // Compare relevant errors
    const errorKeys = Object.keys(prevProps.errors).filter(key =>
      formDataKeys.includes(key)
    )
    for (const key of errorKeys) {
      if (prevProps.errors[key] !== nextProps.errors[key]) {
        return false
      }
    }

    return true
  }
}

// Memoization configuration
export const MEMO_CONFIG = {
  // Section-specific field lists for optimized comparison
  BASIC_INFO_FIELDS: [
    'petNumber', 'ownerId', 'name', 'speciesId', 'breedId',
    'sexId', 'primaryColorId', 'secondaryColorId'
  ],
  BIRTH_AGE_FIELDS: ['dateOfBirth', 'isBirthEstimated'],
  IDENTIFICATION_FIELDS: [
    'microchipNumber', 'microchipDate', 'microchipLocation',
    'tattooNumber', 'registrationNumber'
  ],
  MEDICAL_FIELDS: [
    'isSterilized', 'sterilizationDate', 'sterilizationTypeId',
    'specialNeeds', 'dietaryRestrictions', 'dateOfDeath', 'causeOfDeath',
    'dateOfBirth'
  ],
  BEHAVIORAL_FIELDS: ['behavioralNotes', 'exerciseRequirements'],
  ACQUISITION_FIELDS: ['acquisitionDate', 'acquisitionSource', 'previousOwnerInfo']
} as const