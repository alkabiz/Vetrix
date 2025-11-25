/**
 * @fileoverview Generic utility types for type manipulation and common patterns
 * @module lib/types/utility.types
 */

// ============================================================================
// Basic Utility Types
// ============================================================================

/**
 * Makes all properties of T nullable
 * @example Nullable<{ name: string }> => { name: string | null }
 */
export type Nullable<T> = {
    [K in keyof T]: T[K] | null
}

/**
 * Makes all properties of T optional (undefined)
 * @example Optional<{ name: string }> => { name?: string }
 */
export type Optional<T> = {
    [K in keyof T]?: T[K]
}

/**
 * Makes all properties of T deeply partial (recursive)
 * @example DeepPartial<{ user: { name: string } }> => { user?: { name?: string } }
 */
export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

/**
 * Makes all properties of T deeply recursive partial
 * Handles arrays and nested objects
 */
export type RecursivePartial<T> = {
    [K in keyof T]?: T[K] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[K] extends object
    ? RecursivePartial<T[K]>
    : T[K]
}

/**
 * Adds an id property to type T
 * @example WithId<{ name: string }> => { id: number; name: string }
 */
export type WithId<T, IdType = number> = T & { id: IdType }

/**
 * Makes properties of T readonly recursively
 */
export type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}

/**
 * Extracts properties from T that are required (non-optional)
 */
export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

/**
 * Extracts properties from T that are optional
 */
export type OptionalKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

// ============================================================================
// Timestamp & Audit Types
// ============================================================================

import type { AuditMetadata } from "./common.types"

/**
 * Adds createdAt and updatedAt timestamp fields to type T
 * @example Timestamped<{ name: string }> => { name: string; createdAt: Date; updatedAt: Date }
 */
export type Timestamped<T> = T & {
    readonly createdAt: Date
    readonly updatedAt: Date
}

/**
 * Adds full audit metadata to type T
 * Uses AuditMetadata from common.types which includes soft-delete support
 */
export type Auditable<T> = T & AuditMetadata

/**
 * Soft delete support - adds deletedAt field
 */
export type SoftDeletable<T> = T & {
    readonly deletedAt?: Date | null
    readonly deletedBy?: number | null
}

// ============================================================================
// Database & Repository Types
// ============================================================================

/**
 * Represents a new entity (without id and timestamps)
 * Used for creating new records
 */
export type NewEntity<T extends { id: number | string }> = Omit<
    T,
    "id" | "createdAt" | "updatedAt"
>

/**
 * Represents an entity update (partial, without id and timestamps)
 * Used for updating existing records
 */
export type EntityUpdate<T extends { id: number | string }> = Partial<
    Omit<T, "id" | "createdAt" | "updatedAt">
>

/**
 * Database operation result with row count and last insert ID
 */
export interface DbOperationResult {
    readonly changes: number
    readonly lastInsertRowid: number | bigint
}

// ============================================================================
// Query & Filter Types
// ============================================================================

/**
 * Common sort directions
 */
export type SortDirection = "asc" | "desc"

/**
 * Sort configuration for a specific field
 */
export interface SortConfig<T = string> {
    readonly field: T
    readonly direction: SortDirection
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
    readonly page: number
    readonly pageSize: number
}

/**
 * Filter operators for query building
 */
export type FilterOperator =
    | "eq" // equals
    | "ne" // not equals
    | "gt" // greater than
    | "gte" // greater than or equal
    | "lt" // less than
    | "lte" // less than or equal
    | "like" // SQL LIKE
    | "in" // IN clause
    | "notIn" // NOT IN clause
    | "isNull" // IS NULL
    | "isNotNull" // IS NOT NULL
    | "between" // BETWEEN

/**
 * Single filter condition
 */
export interface FilterCondition<T = unknown> {
    readonly field: string
    readonly operator: FilterOperator
    readonly value?: T | T[] | null
}

/**
 * Complete query parameters including pagination, sorting, and filtering
 */
export interface QueryParams<T = string> {
    readonly pagination?: PaginationParams
    readonly sort?: SortConfig<T> | SortConfig<T>[]
    readonly filters?: FilterCondition[]
    readonly search?: string
    readonly includes?: string[] // For relationship loading
}

/**
 * Makes specific keys of T required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Makes specific keys of T optional
 */
export type OptionalKeys2<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// ============================================================================
// Response & Result Types
// ============================================================================

/**
 * Success result wrapper
 */
export interface Success<T> {
    readonly success: true
    readonly data: T
}

/**
 * Error result wrapper
 */
export interface Failure {
    readonly success: false
    readonly error: {
        readonly code: string
        readonly message: string
        readonly details?: unknown
    }
}

/**
 * Result type that can be either success or failure
 * Useful for operations that might fail
 */
export type Result<T> = Success<T> | Failure

/**
 * Promise that resolves to a Result type
 */
export type AsyncResult<T> = Promise<Result<T>>

// ============================================================================
// Branded Types
// ============================================================================

/**
 * Creates a branded type for type-safe primitives
 * @example type UserId = Brand<number, 'UserId'>
 */
export type Brand<T, B> = T & { readonly __brand: B }

/**
 * Common branded types for ID fields
 */
export type UserId = Brand<number, "UserId">
export type OwnerId = Brand<number, "OwnerId">
export type PetId = Brand<number, "PetId">
export type VeterinarianId = Brand<number, "VeterinarianId">
export type AppointmentId = Brand<number, "AppointmentId">
export type InvoiceId = Brand<number, "InvoiceId">

// ============================================================================
// Type Guards & Helpers
// ============================================================================

/**
 * Extract the type of an array element
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never

/**
 * Extract the type of a Promise
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

/**
 * Get the keys of T that are of type U
 */
export type KeysOfType<T, U> = {
    [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

/**
 * Pick properties from T that are of type U
 */
export type PickByType<T, U> = Pick<T, KeysOfType<T, U>>

/**
 * Omit properties from T that are of type U
 */
export type OmitByType<T, U> = Omit<T, KeysOfType<T, U>>

/**
 * Makes properties K of type T mutable (removes readonly)
 */
export type Mutable<T, K extends keyof T = keyof T> = {
    -readonly [P in K]: T[P]
} & Omit<T, K>

/**
 * Non-nullable version of T (removes null and undefined)
 */
export type NonNullableFields<T> = {
    [K in keyof T]: NonNullable<T[K]>
}

/**
 * Creates a type with all properties of T as readonly except for K
 */
export type ReadonlyExcept<T, K extends keyof T> = Readonly<Omit<T, K>> & Pick<T, K>

// ============================================================================
// Function Types
// ============================================================================

/**
 * Generic function type
 */
export type Fn<Args extends unknown[] = unknown[], Return = unknown> = (
    ...args: Args
) => Return

/**
 * Async function type
 */
export type AsyncFn<Args extends unknown[] = unknown[], Return = unknown> = (
    ...args: Args
) => Promise<Return>

/**
 * Void function type
 */
export type VoidFn<Args extends unknown[] = unknown[]> = (...args: Args) => void

/**
 * Predicate function type
 */
export type PredicateFn<T> = (value: T) => boolean

/**
 * Comparator function type
 */
export type ComparatorFn<T> = (a: T, b: T) => number

// ============================================================================
// Conditional & Mapped Types
// ============================================================================

/**
 * Creates a union of literal types from an object's values
 */
export type ValueOf<T> = T[keyof T]

/**
 * Creates a union type from an array of literals
 */
export type ElementOf<T extends readonly unknown[]> = T[number]

/**
 * Checks if a type extends another type
 */
export type Extends<T, U> = T extends U ? true : false

/**
 * Returns true if types are equal, false otherwise
 */
export type Equals<T, U> = T extends U ? (U extends T ? true : false) : false

/**
 * Ensures exhaustive switch/if statements
 */
export type UnreachableCase = never

/**
 * Extracts constructor parameters
 */
export type ConstructorParams<T> = T extends new (...args: infer P) => unknown
    ? P
    : never

/**
 * Extracts instance type from constructor
 */
export type InstanceTypeOf<T> = T extends new (...args: unknown[]) => infer R
    ? R
    : never
