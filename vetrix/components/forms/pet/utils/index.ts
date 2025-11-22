// components/forms/pet/utils/index.ts

// Form helpers
export {
  generatePetNumber,
  getInitialFormData,
  initializeFormFromPet,
  hasFormChanges,
  normalizeFormData,
  validateRequiredFields,
  getFieldDisplayValue
} from "./form-helpers"

// Data transformers
export {
  transformFormDataToPet,
  transformPetToFormData,
  sanitizeFormData,
  prepareFormDataForSubmission,
  mergeFormDataUpdates,
  extractChangedFields
} from "./data-transformers"

// Date utilities
export {
  formatDateForInput,
  parseDateFromInput,
  calculateAge,
  calculateAgeString,
  isValidPastDate,
  isValidDateAfter,
  isSameDate,
  getMinDate,
  getMaxDate,
  getDateDifferenceInDays,
  formatDateForDisplay,
  isValidDateString
} from "./date-utils"

// Default values and configuration
export {
  DEFAULT_PET_FORM_VALUES,
  PET_FORM_CONFIG,
  FIELD_LABELS,
  FIELD_PLACEHOLDERS
} from "../types/form-data.types"