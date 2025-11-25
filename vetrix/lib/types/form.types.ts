/**
 * @fileoverview Form state management and validation types
 * @module lib/types/form.types
 */

// ============================================================================
// Form Field State
// ============================================================================

/**
 * State of a single form field with validation support
 * @template T - The value type of the field
 */
export interface FormField<T = unknown> {
    /** Current value of the field */
    value: T
    /** Validation error message if invalid */
    error?: string | null
    /** Whether the field has been touched/visited */
    touched: boolean
    /** Whether the field is currently valid */
    valid: boolean
    /** Whether the field value has been modified */
    dirty: boolean
    /** Whether the field is currently being validated */
    validating?: boolean
    /** Whether the field is disabled */
    disabled?: boolean
    /** Custom validation rules for this field */
    rules?: ValidationRule<T>[]
}

/**
 * Complete form schema mapping field names to their states
 * @template T - The form data type
 */
export type FormSchema<T extends Record<string, unknown>> = {
    [K in keyof T]: FormField<T[K]>
}

/**
 * Partial form schema for updates
 */
export type PartialFormSchema<T extends Record<string, unknown>> = {
    [K in keyof T]?: Partial<FormField<T[K]>>
}

// ============================================================================
// Form State Management
// ============================================================================

/**
 * Complete form state including all fields and global state
 * @template T - The form data type
 */
export interface FormState<T extends Record<string, unknown>> {
    /** Field states */
    fields: FormSchema<T>
    /** Whether the entire form is valid */
    isValid: boolean
    /** Whether the form has been submitted */
    isSubmitted: boolean
    /** Whether the form is currently submitting */
    isSubmitting: boolean
    /** Whether any field has been touched */
    isTouched: boolean
    /** Whether any field has been modified */
    isDirty: boolean
    /** Global form errors not tied to specific fields */
    errors: string[]
    /** Number of times the form has been submitted */
    submitCount: number
}

/**
 * Form configuration options
 */
export interface FormConfig<T extends Record<string, unknown>> {
    /** Initial values for form fields */
    initialValues: T
    /** Validation schema */
    validationSchema?: ValidationSchema<T>
    /** Whether to validate on blur */
    validateOnBlur?: boolean
    /** Whether to validate on change */
    validateOnChange?: boolean
    /** Whether to validate on mount */
    validateOnMount?: boolean
    /** Whether to reset form after successful submit */
    resetOnSubmit?: boolean
    /** Custom submit handler */
    onSubmit?: (values: T) => void | Promise<void>
    /** Custom validation handler */
    onValidate?: (values: T) => ValidationResult | Promise<ValidationResult>
}

/**
 * Form actions for state updates
 */
export interface FormActions<T extends Record<string, unknown>> {
    /** Set value of a specific field */
    setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void
    /** Set error for a specific field */
    setFieldError: <K extends keyof T>(field: K, error: string | null) => void
    /** Mark field as touched */
    setFieldTouched: <K extends keyof T>(field: K, touched: boolean) => void
    /** Set multiple values at once */
    setValues: (values: Partial<T>) => void
    /** Set multiple errors at once */
    setErrors: (errors: Partial<Record<keyof T, string>>) => void
    /** Validate a specific field */
    validateField: <K extends keyof T>(field: K) => Promise<boolean>
    /** Validate all fields */
    validateForm: () => Promise<boolean>
    /** Submit the form */
    submitForm: () => Promise<void>
    /** Reset the form to initial state */
    resetForm: (values?: Partial<T>) => void
    /** Clear all errors */
    clearErrors: () => void
}

/**
 * Complete form API combining state and actions
 */
export type FormAPI<T extends Record<string, unknown>> = FormState<T> & FormActions<T>

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation function for a field
 * @template T - The value type
 */
export type ValidatorFn<T = unknown> = (
    value: T,
    formValues?: Record<string, unknown>
) => string | null | Promise<string | null>

/**
 * Validation rule with type and optional parameters
 * @template T - The value type
 */
export interface ValidationRule<T = unknown> {
    /** Type of validation rule */
    type: ValidationRuleType
    /** Validator function */
    validator: ValidatorFn<T>
    /** Custom error message */
    message?: string
    /** Rule parameters */
    params?: Record<string, unknown>
}

/**
 * Built-in validation rule types
 */
export type ValidationRuleType =
    | "required"
    | "email"
    | "phone"
    | "url"
    | "numeric"
    | "integer"
    | "alpha"
    | "alphanumeric"
    | "minLength"
    | "maxLength"
    | "min"
    | "max"
    | "pattern"
    | "matches"
    | "oneOf"
    | "custom"
    | "date"
    | "dateRange"
    | "file"
    | "fileSize"
    | "fileType"

/**
 * Validation schema defining rules for all fields
 * @template T - The form data type
 */
export type ValidationSchema<T extends Record<string, unknown>> = {
    [K in keyof T]?: ValidationRule<T[K]>[]
}

/**
 * Result of form validation
 */
export interface ValidationResult {
    /** Whether the form is valid */
    isValid: boolean
    /** Map of field names to error messages */
    errors: Record<string, string[]>
    /** Global errors not tied to specific fields */
    globalErrors?: string[]
}

/**
 * Field validation result
 */
export interface FieldValidationResult {
    /** Whether the field is valid */
    isValid: boolean
    /** Error message if invalid */
    error?: string | null
}

// ============================================================================
// Built-in Validators
// ============================================================================

/**
 * Configuration for required validator
 */
export interface RequiredValidatorConfig {
    /** Custom error message */
    message?: string
    /** Whether to trim whitespace before checking */
    trim?: boolean
}

/**
 * Configuration for length validators
 */
export interface LengthValidatorConfig {
    /** Minimum or maximum length */
    length: number
    /** Custom error message */
    message?: string
}

/**
 * Configuration for range validators
 */
export interface RangeValidatorConfig {
    /** Minimum or maximum value */
    value: number
    /** Custom error message */
    message?: string
    /** Whether the value is inclusive */
    inclusive?: boolean
}

/**
 * Configuration for pattern validator
 */
export interface PatternValidatorConfig {
    /** Regular expression pattern */
    pattern: RegExp | string
    /** Custom error message */
    message?: string
}

/**
 * Configuration for file size validator
 */
export interface FileSizeValidatorConfig {
    /** Maximum file size in bytes */
    maxSize: number
    /** Custom error message */
    message?: string
}

/**
 * Configuration for file type validator
 */
export interface FileTypeValidatorConfig {
    /** Allowed MIME types */
    allowedTypes: string[]
    /** Custom error message */
    message?: string
}

// ============================================================================
// Form Events
// ============================================================================

/**
 * Form field change event
 */
export interface FormFieldChangeEvent<T = unknown> {
    /** Name of the field that changed */
    field: string
    /** New value */
    value: T
    /** Previous value */
    previousValue: T
    /** Whether the field is now valid */
    isValid: boolean
}

/**
 * Form submit event
 */
export interface FormSubmitEvent<T extends Record<string, unknown>> {
    /** Form values being submitted */
    values: T
    /** Whether the form is valid */
    isValid: boolean
    /** Timestamp of submit */
    timestamp: Date
}

/**
 * Form validation event
 */
export interface FormValidationEvent {
    /** Fields that were validated */
    fields: string[]
    /** Validation result */
    result: ValidationResult
    /** Validation trigger */
    trigger: ValidationTrigger
}

/**
 * What triggered the validation
 */
export type ValidationTrigger = "blur" | "change" | "submit" | "manual" | "mount"

// ============================================================================
// Form Utilities
// ============================================================================

/**
 * Extract plain values from form schema
 * @template T - The form data type
 */
export type FormValues<T extends Record<string, unknown>> = {
    [K in keyof T]: T[K]
}

/**
 * Extract errors from form schema
 */
export type FormErrors<T extends Record<string, unknown>> = {
    [K in keyof T]?: string | null
}

/**
 * Extract touched state from form schema
 */
export type FormTouched<T extends Record<string, unknown>> = {
    [K in keyof T]?: boolean
}

/**
 * Field metadata for advanced use cases
 */
export interface FieldMetadata {
    /** Field name/key */
    name: string
    /** Field label for display */
    label?: string
    /** Field placeholder */
    placeholder?: string
    /** Help text */
    helpText?: string
    /** Whether the field is required */
    required?: boolean
    /** Field type */
    type?: FieldType
    /** Custom metadata */
    meta?: Record<string, unknown>
}

/**
 * Common form field types
 */
export type FieldType =
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "textarea"
    | "select"
    | "multiselect"
    | "checkbox"
    | "radio"
    | "date"
    | "time"
    | "datetime"
    | "file"
    | "hidden"

// ============================================================================
// Async Validation
// ============================================================================

/**
 * Async validator function
 */
export type AsyncValidatorFn<T = unknown> = (
    value: T,
    formValues?: Record<string, unknown>
) => Promise<string | null>

/**
 * Async validation configuration
 */
export interface AsyncValidationConfig {
    /** Debounce delay in milliseconds */
    debounce?: number
    /** Whether to validate on blur */
    validateOnBlur?: boolean
    /** Whether to validate on change */
    validateOnChange?: boolean
}

/**
 * Async validation state
 */
export interface AsyncValidationState {
    /** Whether async validation is in progress */
    isValidating: boolean
    /** Last validation timestamp */
    lastValidatedAt?: Date
    /** Validation error if any */
    error?: string | null
}

// ============================================================================
// Form Arrays & Dynamic Fields
// ============================================================================

/**
 * Form array for dynamic lists of fields
 * @template T - The item type in the array
 */
export interface FormArray<T> {
    /** Array of items */
    items: FormField<T>[]
    /** Add a new item */
    push: (value: T) => void
    /** Remove an item at index */
    remove: (index: number) => void
    /** Insert item at specific index */
    insert: (index: number, value: T) => void
    /** Swap two items */
    swap: (indexA: number, indexB: number) => void
    /** Move item from one index to another */
    move: (from: number, to: number) => void
    /** Update item at index */
    update: (index: number, value: T) => void
    /** Clear all items */
    clear: () => void
}

// ============================================================================
// Conditional & Dependent Fields
// ============================================================================

/**
 * Field dependency configuration
 */
export interface FieldDependency<T extends Record<string, unknown>> {
    /** Field that this field depends on */
    dependsOn: keyof T
    /** Condition function to determine if field should be shown/enabled */
    condition: (dependentValue: unknown, formValues: T) => boolean
    /** Action to take when condition is met/not met */
    action?: DependencyAction
}

/**
 * Actions to take based on dependency
 */
export type DependencyAction = "show" | "hide" | "enable" | "disable" | "validate" | "clear"

/**
 * Conditional validation based on other fields
 */
export interface ConditionalValidation<T extends Record<string, unknown>> {
    /** Condition to check */
    condition: (formValues: T) => boolean
    /** Validation rules to apply if condition is true */
    rules: ValidationRule[]
}

// ============================================================================
// Form Wizard / Multi-Step Forms
// ============================================================================

/**
 * Multi-step form configuration
 */
export interface FormWizardConfig<T extends Record<string, unknown>> {
    /** Steps in the wizard */
    steps: FormStep<T>[]
    /** Current step index */
    currentStep: number
    /** Whether to validate on step change */
    validateOnStepChange?: boolean
    /** Whether steps can be skipped */
    allowSkip?: boolean
}

/**
 * Single step in a multi-step form
 */
export interface FormStep<T extends Record<string, unknown>> {
    /** Step identifier */
    id: string
    /** Step label */
    label: string
    /** Fields included in this step */
    fields: (keyof T)[]
    /** Optional validation schema for this step */
    validationSchema?: ValidationSchema<Partial<T>>
    /** Whether this step can be skipped */
    optional?: boolean
    /** Custom completion check */
    isComplete?: (values: T) => boolean
}

/**
 * Form wizard state
 */
export interface FormWizardState<T extends Record<string, unknown>> {
    /** Form state */
    form: FormState<T>
    /** Current step index */
    currentStep: number
    /** Whether wizard is complete */
    isComplete: boolean
    /** Completed steps */
    completedSteps: Set<string>
    /** Navigation actions */
    actions: WizardActions
}

/**
 * Form wizard navigation actions
 */
export interface WizardActions {
    /** Go to next step */
    nextStep: () => Promise<boolean>
    /** Go to previous step */
    previousStep: () => void
    /** Go to specific step */
    goToStep: (stepIndex: number) => Promise<boolean>
    /** Complete the wizard */
    complete: () => Promise<void>
    /** Reset the wizard */
    reset: () => void
}
