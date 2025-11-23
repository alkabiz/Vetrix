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