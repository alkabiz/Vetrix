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