import { isEqual } from 'lodash'

/**
 * Custom comparison functions for React.memo
 */

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
  return isEqual(prevProps, nextProps)
}

// Section-specific comparison functions
export const createSectionPropsComparator = <T extends { formData: any; errors: any; disabled?: boolean }>(
  formDataKeys: string[]
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
    'specialNeeds', 'dietaryRestrictions', 'dateOfDeath', 'causeOfDeath'
  ],
  BEHAVIORAL_FIELDS: ['behavioralNotes', 'exerciseRequirements'],
  ACQUISITION_FIELDS: ['acquisitionDate', 'acquisitionSource', 'previousOwnerInfo']
} as const