import type { PetFormData, PetFormErrors } from "./PetForm.types"

export interface BaseSectionProps {
  formData: Partial<PetFormData>
  errors: PetFormErrors
  onFieldChange: <K extends keyof PetFormData>(field: K, value: PetFormData[K]) => void
  disabled?: boolean
}

// Custom prop comparison for React.memo
export const areSectionPropsEqual = <T extends BaseSectionProps>(
  prevProps: T,
  nextProps: T
): boolean => {
  return (
    prevProps.disabled === nextProps.disabled &&
    JSON.stringify(prevProps.formData) === JSON.stringify(nextProps.formData) &&
    JSON.stringify(prevProps.errors) === JSON.stringify(nextProps.errors)
  )
}