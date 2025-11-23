// Main exports
export { PetForm } from "./PetForm"
export type { PetFormProps } from "./types/PetForm.types"

// Section exports (for potential reuse)
export { BasicInformationSection } from "./sections/BasicInformationSection"
export { BirthAndAgeSection } from "./sections/BirthAndAgeSection"
export { IdentificationSection } from "./sections/IdentificationSection"
export { MedicalInformationSection } from "./sections/MedicalInformationSection"
export { BehavioralAndCareSection } from "./sections/BehavioralAndCareSection"
export { AcquisitionInformationSection } from "./sections/AcquisitionInformationSection"

// Hook exports
export { usePetForm } from "./hooks/usePetForm"
export { usePetFormValidation } from "./hooks/usePetFormValidation"
export { useDynamicOptions } from "./hooks/useDynamicOptions"

// Utility exports
export { 
  DEFAULT_PET_FORM_VALUES, 
  PET_FORM_CONFIG,
  FIELD_LABELS,
  FIELD_PLACEHOLDERS 
} from "./utils/date-utils"

// Type exports
export type { 
  PetFormData, 
  PetFormErrors,
  BasicInformationData,
  MedicalInformationData,
  SpeciesOption,
  BreedOption,
  ColorOption 
} from "./types/PetForm.types"