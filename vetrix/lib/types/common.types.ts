/**
 * @fileoverview Cross-cutting domain types used across the application
 * @module lib/types/common.types
 */

// ============================================================================
// Gender & Sex Types
// ============================================================================

/**
 * Biological sex classification
 * M = Male, F = Female, U = Unknown/Undetermined
 */
export type Sex = "M" | "F" | "U"

/**
 * Human gender identity
 */
export type Gender = "male" | "female" | "non-binary" | "prefer-not-to-say" | "other"

// ============================================================================
// Status Types
// ============================================================================

/**
 * Generic active/inactive status
 */
export type ActiveStatus = "active" | "inactive"

/**
 * Generic enabled/disabled status
 */
export type EnabledStatus = "enabled" | "disabled"

/**
 * User account status
 */
export type UserStatus = "active" | "inactive" | "pending" | "suspended" | "deleted"

/**
 * Employment status
 */
export type EmploymentStatus = "active" | "inactive" | "on-leave" | "terminated"

/**
 * Appointment status
 */
export type AppointmentStatus =
    | "scheduled"
    | "confirmed"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "no-show"
    | "rescheduled"

/**
 * Payment status
 */
export type PaymentStatus = "pending" | "processing" | "confirmed" | "failed" | "refunded" | "cancelled"

/**
 * Invoice status
 */
export type InvoiceStatus = "draft" | "issued" | "paid" | "partially-paid" | "overdue" | "cancelled"

/**
 * General processing status
 */
export type ProcessingStatus = "pending" | "processing" | "completed" | "failed"

// ============================================================================
// Contact Information
// ============================================================================

/**
 * Email address with validation
 */
export interface Email {
    readonly address: string
    readonly isPrimary?: boolean
    readonly isVerified?: boolean
    readonly verifiedAt?: Date
}

/**
 * Phone number with type classification
 */
export interface PhoneNumber {
    readonly number: string
    readonly type: PhoneType
    readonly isPrimary?: boolean
    readonly countryCode?: string
    readonly extension?: string
}

/**
 * Phone number type
 */
export type PhoneType = "mobile" | "home" | "work" | "fax" | "other"

/**
 * Complete contact information
 */
export interface ContactInfo {
    readonly emails?: Email[]
    readonly phones?: PhoneNumber[]
    readonly preferredContactMethod?: ContactMethod
}

/**
 * Preferred contact method
 */
export type ContactMethod = "email" | "phone" | "sms" | "whatsapp"

// ============================================================================
// Address & Location
// ============================================================================

/**
 * Physical address structure
 */
export interface Address {
    readonly street?: string
    readonly street2?: string
    readonly city?: string
    readonly cityId?: number
    readonly state?: string
    readonly stateId?: number
    readonly postalCode?: string
    readonly country?: string
    readonly countryId?: number
    readonly countryCode?: string // ISO 3166-1 alpha-2
    readonly latitude?: number
    readonly longitude?: number
}

/**
 * Coordinates for geolocation
 */
export interface Coordinates {
    readonly latitude: number
    readonly longitude: number
    readonly accuracy?: number
    readonly altitude?: number
}

// ============================================================================
// Identification & Documentation
// ============================================================================

/**
 * Identification type codes
 */
export type IdentificationType = "CC" | "CE" | "TI" | "PA" | "NIT" | "RC" | "DNI" | "OTHER"

/**
 * Identification document
 */
export interface Identification {
    readonly type: IdentificationType
    readonly typeId?: number
    readonly number: string
    readonly issuedBy?: string
    readonly issuedDate?: Date
    readonly expiryDate?: Date
}

// ============================================================================
// Currency & Money
// ============================================================================

/**
 * ISO 4217 currency codes (common ones)
 */
export type CurrencyCode = "USD" | "EUR" | "GBP" | "COP" | "MXN" | "ARS" | "BRL" | "CLP" | "PEN"

/**
 * Money amount with currency
 */
export interface Money {
    readonly amount: number
    readonly currency: CurrencyCode
}

/**
 * Price with optional discount
 */
export interface Price extends Money {
    readonly originalAmount?: number
    readonly discount?: number
    readonly discountType?: DiscountType
}

/**
 * Discount type
 */
export type DiscountType = "percentage" | "fixed" | "none"

// ============================================================================
// Date & Time
// ============================================================================

/**
 * Date range
 */
export interface DateRange {
    readonly start: Date
    readonly end: Date
}

/**
 * Time slot for scheduling
 */
export interface TimeSlot {
    readonly startTime: string // HH:mm format
    readonly endTime: string // HH:mm format
    readonly dayOfWeek?: DayOfWeek
}

/**
 * Day of week (1 = Monday, 7 = Sunday)
 */
export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7

/**
 * Time zone representation
 */
export interface TimeZone {
    readonly name: string // e.g., "America/Bogota"
    readonly offset: number // UTC offset in minutes
    readonly abbreviation?: string // e.g., "COT"
}

// ============================================================================
// Audit & Tracking
// ============================================================================

/**
 * Audit metadata for entity tracking
 */
export interface AuditMetadata {
    readonly createdAt: Date
    readonly createdBy?: number
    readonly updatedAt: Date
    readonly updatedBy?: number
    readonly deletedAt?: Date | null
    readonly deletedBy?: number | null
}

/**
 * Change log entry
 */
export interface ChangeLog {
    readonly id: number
    readonly entityType: string
    readonly entityId: number
    readonly action: ChangeAction
    readonly changes: Record<string, ChangeDetail>
    readonly performedBy: number
    readonly performedAt: Date
    readonly ipAddress?: string
    readonly userAgent?: string
}

/**
 * Type of change action
 */
export type ChangeAction = "create" | "update" | "delete" | "restore"

/**
 * Details of a single field change
 */
export interface ChangeDetail {
    readonly oldValue: unknown
    readonly newValue: unknown
}

// ============================================================================
// File & Media
// ============================================================================

/**
 * File metadata
 */
export interface FileMetadata {
    readonly filename: string
    readonly originalFilename?: string
    readonly mimeType: string
    readonly size: number // In bytes
    readonly extension?: string
    readonly path?: string
    readonly url?: string
    readonly checksum?: string
    readonly uploadedAt: Date
    readonly uploadedBy?: number
}

/**
 * Image metadata with dimensions
 */
export interface ImageMetadata extends FileMetadata {
    readonly width: number
    readonly height: number
    readonly aspectRatio?: number
    readonly thumbnailUrl?: string
}

/**
 * File type categories
 */
export type FileType = "image" | "document" | "video" | "audio" | "archive" | "other"

// ============================================================================
// Species & Breeds (Veterinary-specific)
// ============================================================================

/**
 * Common pet species
 */
export type Species = "dog" | "cat" | "bird" | "rabbit" | "hamster" | "fish" | "reptile" | "other"

/**
 * Size category for pets
 */
export type SizeCategory = "toy" | "small" | "medium" | "large" | "giant"

/**
 * Sterilization status
 */
export type SterilizationStatus = "intact" | "neutered" | "spayed" | "unknown"

// ============================================================================
// Priority & Severity
// ============================================================================

/**
 * Priority levels
 */
export type Priority = "low" | "normal" | "high" | "urgent" | "emergency"

/**
 * Severity levels
 */
export type Severity = "info" | "warning" | "error" | "critical"

/**
 * Urgency classification
 */
export type Urgency = "routine" | "urgent" | "emergency"

// ============================================================================
// Consent & Permissions
// ============================================================================

/**
 * Consent record
 */
export interface Consent {
    readonly type: ConsentType
    readonly granted: boolean
    readonly grantedAt?: Date
    readonly revokedAt?: Date
    readonly version?: string
}

/**
 * Types of consent
 */
export type ConsentType =
    | "marketing"
    | "data-processing"
    | "third-party-sharing"
    | "medical-treatment"
    | "privacy-policy"
    | "terms-of-service"

// ============================================================================
// Notification & Communication
// ============================================================================

/**
 * Notification preference
 */
export interface NotificationPreference {
    readonly channel: NotificationChannel
    readonly enabled: boolean
    readonly frequency?: NotificationFrequency
}

/**
 * Notification channels
 */
export type NotificationChannel = "email" | "sms" | "push" | "in-app" | "whatsapp"

/**
 * Notification frequency
 */
export type NotificationFrequency = "immediate" | "daily" | "weekly" | "monthly" | "never"

/**
 * Notification type
 */
export type NotificationType =
    | "appointment-reminder"
    | "appointment-confirmation"
    | "payment-reminder"
    | "invoice"
    | "system"
    | "marketing"
    | "alert"

// ============================================================================
// Language & Localization
// ============================================================================

/**
 * Supported languages (ISO 639-1)
 */
export type LanguageCode = "en" | "es" | "fr" | "de" | "pt" | "it"

/**
 * Locale with language and region
 */
export interface Locale {
    readonly language: LanguageCode
    readonly region?: string // ISO 3166-1 alpha-2
    readonly timezone?: string
    readonly currency?: CurrencyCode
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Error severity for logging and monitoring
 */
export type ErrorSeverity = "low" | "medium" | "high" | "critical"

/**
 * Error category for classification
 */
export type ErrorCategory =
    | "validation"
    | "authentication"
    | "authorization"
    | "not-found"
    | "conflict"
    | "business-logic"
    | "system"
    | "network"
    | "unknown"

// ============================================================================
// Named Entities
// ============================================================================

/**
 * Person name components
 */
export interface PersonName {
    readonly firstName: string
    readonly middleName?: string
    readonly lastName: string
    readonly secondLastName?: string
    readonly prefix?: string // Dr., Mr., Mrs., etc.
    readonly suffix?: string // Jr., Sr., III, etc.
    readonly displayName?: string
}

/**
 * Full name as a single string
 */
export type FullName = string

// ============================================================================
// Generic Key-Value Types
// ============================================================================

/**
 * Generic key-value pair
 */
export interface KeyValuePair<K = string, V = unknown> {
    readonly key: K
    readonly value: V
}

/**
 * Named value for select options
 */
export interface NamedValue<T = string | number> {
    readonly name: string
    readonly value: T
    readonly description?: string
    readonly metadata?: Record<string, unknown>
}

/**
 * Option for select/dropdown components
 */
export interface SelectOption<T = string | number> {
    readonly label: string
    readonly value: T
    readonly disabled?: boolean
    readonly group?: string
    readonly icon?: string
}

// ============================================================================
// Metrics & Analytics
// ============================================================================

/**
 * Metric data point
 */
export interface Metric {
    readonly name: string
    readonly value: number
    readonly unit?: string
    readonly timestamp: Date
    readonly tags?: Record<string, string>
}

/**
 * Time-series data point
 */
export interface TimeSeriesPoint {
    readonly timestamp: Date
    readonly value: number
    readonly label?: string
}
