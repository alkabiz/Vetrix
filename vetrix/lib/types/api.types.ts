/**
 * @fileoverview API response and request types for consistent API communication
 * @module lib/types/api.types
 */

// ============================================================================
// HTTP & Network Types
// ============================================================================

/**
 * Standard HTTP methods
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD"

/**
 * HTTP status codes organized by category
 */
export enum HttpStatusCode {
    // Success 2xx
    OK = 200,
    Created = 201,
    Accepted = 202,
    NoContent = 204,

    // Redirection 3xx
    MovedPermanently = 301,
    Found = 302,
    NotModified = 304,

    // Client Errors 4xx
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    Conflict = 409,
    UnprocessableEntity = 422,
    TooManyRequests = 429,

    // Server Errors 5xx
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
}

/**
 * Standard error codes for application-level errors
 */
export enum ApiErrorCode {
    // Authentication & Authorization
    UNAUTHENTICATED = "UNAUTHENTICATED",
    UNAUTHORIZED = "UNAUTHORIZED",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    TOKEN_INVALID = "TOKEN_INVALID",
    INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",

    // Validation
    VALIDATION_ERROR = "VALIDATION_ERROR",
    INVALID_INPUT = "INVALID_INPUT",
    MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",
    INVALID_FORMAT = "INVALID_FORMAT",

    // Resource
    RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
    RESOURCE_ALREADY_EXISTS = "RESOURCE_ALREADY_EXISTS",
    RESOURCE_CONFLICT = "RESOURCE_CONFLICT",
    RESOURCE_LOCKED = "RESOURCE_LOCKED",

    // Business Logic
    BUSINESS_RULE_VIOLATION = "BUSINESS_RULE_VIOLATION",
    OPERATION_NOT_ALLOWED = "OPERATION_NOT_ALLOWED",
    INVALID_STATE = "INVALID_STATE",

    // System
    INTERNAL_ERROR = "INTERNAL_ERROR",
    DATABASE_ERROR = "DATABASE_ERROR",
    EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
    NETWORK_ERROR = "NETWORK_ERROR",
    TIMEOUT = "TIMEOUT",

    // Rate Limiting
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
    QUOTA_EXCEEDED = "QUOTA_EXCEEDED",

    // Unknown
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * API environment types
 */
export type ApiEnvironment = "development" | "staging" | "production" | "test"

// ============================================================================
// API Error Types
// ============================================================================

/**
 * Field-level validation error
 */
export interface FieldError {
    readonly field: string
    readonly message: string
    readonly code?: string
    readonly value?: unknown
}

/**
 * Comprehensive API error structure
 */
export interface ApiError {
    /** Error code for programmatic handling */
    readonly code: ApiErrorCode | string
    /** Human-readable error message */
    readonly message: string
    /** HTTP status code */
    readonly statusCode?: number
    /** Additional error details */
    readonly details?: unknown
    /** Field-specific validation errors */
    readonly fieldErrors?: FieldError[]
    /** Stack trace (only in development) */
    readonly stack?: string
    /** Request ID for tracing */
    readonly requestId?: string
    /** Timestamp of the error */
    readonly timestamp?: string
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Successful API response wrapper
 */
export interface ApiSuccessResponse<T> {
    /** Indicates successful response */
    readonly success: true
    /** Response payload */
    readonly data: T
    /** Optional metadata */
    readonly meta?: ResponseMetadata
}

/**
 * Failed API response wrapper
 */
export interface ApiErrorResponse {
    /** Indicates failed response */
    readonly success: false
    /** Error details */
    readonly error: ApiError
    /** Optional metadata */
    readonly meta?: ResponseMetadata
}

/**
 * Generic API response that can be success or error
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

/**
 * Response metadata for additional context
 */
export interface ResponseMetadata {
    /** Request ID for tracing */
    readonly requestId?: string
    /** Response timestamp */
    readonly timestamp?: string
    /** API version */
    readonly version?: string
    /** Execution time in milliseconds */
    readonly executionTime?: number
    /** Additional custom metadata */
    readonly [key: string]: unknown
}

// ============================================================================
// Pagination Types
// ============================================================================

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    /** Current page number (1-indexed) */
    readonly page: number
    /** Number of items per page */
    readonly pageSize: number
    /** Total number of pages */
    readonly totalPages: number
    /** Total number of items across all pages */
    readonly totalItems: number
    /** Whether there is a next page */
    readonly hasNextPage: boolean
    /** Whether there is a previous page */
    readonly hasPreviousPage: boolean
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
    /** Array of items for current page */
    readonly items: T[]
    /** Pagination metadata */
    readonly pagination: PaginationMeta
}

/**
 * Cursor-based pagination metadata (for large datasets)
 */
export interface CursorPaginationMeta {
    /** Cursor for the next page */
    readonly nextCursor?: string | null
    /** Cursor for the previous page */
    readonly previousCursor?: string | null
    /** Whether there are more items */
    readonly hasMore: boolean
    /** Number of items in current page */
    readonly count: number
}

/**
 * Cursor-based paginated response
 */
export interface CursorPaginatedResponse<T> {
    /** Array of items for current page */
    readonly items: T[]
    /** Cursor pagination metadata */
    readonly cursor: CursorPaginationMeta
}

// ============================================================================
// API Request Types
// ============================================================================

/**
 * Standard query parameters for list endpoints
 */
export interface ListQueryParams {
    /** Page number (1-indexed) */
    readonly page?: number
    /** Items per page */
    readonly pageSize?: number
    /** Sort field */
    readonly sortBy?: string
    /** Sort direction */
    readonly sortOrder?: "asc" | "desc"
    /** Search query */
    readonly search?: string
    /** Filter parameters */
    readonly filter?: Record<string, string | number | boolean | null>
    /** Fields to include in response */
    readonly fields?: string[]
    /** Related entities to include */
    readonly include?: string[]
}

/**
 * Request configuration for API calls
 */
export interface ApiRequestConfig {
    /** HTTP method */
    readonly method: HttpMethod
    /** Request headers */
    readonly headers?: Record<string, string>
    /** Query parameters */
    readonly params?: Record<string, string | number | boolean | null>
    /** Request body */
    readonly body?: unknown
    /** Request timeout in milliseconds */
    readonly timeout?: number
    /** Whether to include credentials */
    readonly credentials?: boolean
    /** Retry configuration */
    readonly retry?: RetryConfig
}

/**
 * Retry configuration for failed requests
 */
export interface RetryConfig {
    /** Maximum number of retry attempts */
    readonly maxAttempts: number
    /** Delay between retries in milliseconds */
    readonly delay: number
    /** Exponential backoff multiplier */
    readonly backoffMultiplier?: number
    /** HTTP status codes that should trigger retry */
    readonly retryOnStatusCodes?: number[]
}

// ============================================================================
// API Action Types
// ============================================================================

/**
 * CRUD operation types
 */
export type CrudOperation = "create" | "read" | "update" | "delete" | "list"

/**
 * API action metadata
 */
export interface ApiActionMeta {
    /** Type of operation */
    readonly operation: CrudOperation
    /** Resource being operated on */
    readonly resource: string
    /** User ID performing the action */
    readonly userId?: number
    /** Client IP address */
    readonly ipAddress?: string
    /** User agent */
    readonly userAgent?: string
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * API validation rule types (basic string union)
 */
export type ApiValidationRuleType =
    | "required"
    | "email"
    | "phone"
    | "url"
    | "numeric"
    | "alpha"
    | "alphanumeric"
    | "minLength"
    | "maxLength"
    | "min"
    | "max"
    | "pattern"
    | "custom"

/**
 * Validation constraint definition
 */
export interface ValidationConstraint {
    readonly rule: ApiValidationRuleType
    readonly value?: unknown
    readonly message?: string
}

/**
 * Schema validation result for API requests
 */
export interface ApiValidationResult {
    readonly isValid: boolean
    readonly errors: Record<string, string[]>
}

// ============================================================================
// Batch Operation Types
// ============================================================================

/**
 * Batch operation request
 */
export interface BatchRequest<T> {
    readonly operations: BatchOperation<T>[]
    readonly stopOnError?: boolean
}

/**
 * Single batch operation
 */
export interface BatchOperation<T> {
    readonly id: string
    readonly operation: CrudOperation
    readonly data: T
}

/**
 * Batch operation response
 */
export interface BatchResponse<T> {
    readonly results: BatchOperationResult<T>[]
    readonly summary: BatchSummary
}

/**
 * Result of a single batch operation
 */
export interface BatchOperationResult<T> {
    readonly id: string
    readonly success: boolean
    readonly data?: T
    readonly error?: ApiError
}

/**
 * Summary of batch operation
 */
export interface BatchSummary {
    readonly total: number
    readonly successful: number
    readonly failed: number
    readonly executionTime: number
}

// ============================================================================
// File Upload Types
// ============================================================================

/**
 * File upload metadata
 */
export interface FileUploadMeta {
    readonly filename: string
    readonly mimeType: string
    readonly size: number
    readonly uploadedAt: string
    readonly uploadedBy?: number
    readonly checksum?: string
}

/**
 * File upload response
 */
export interface FileUploadResponse {
    readonly id: string
    readonly url: string
    readonly metadata: FileUploadMeta
}

// ============================================================================
// WebSocket Types
// ============================================================================

/**
 * WebSocket message types
 */
export type WebSocketMessageType =
    | "connect"
    | "disconnect"
    | "subscribe"
    | "unsubscribe"
    | "message"
    | "error"
    | "ping"
    | "pong"

/**
 * WebSocket message structure
 */
export interface WebSocketMessage<T = unknown> {
    readonly type: WebSocketMessageType
    readonly channel?: string
    readonly payload?: T
    readonly timestamp: string
    readonly messageId?: string
}

// ============================================================================
// Health Check Types
// ============================================================================

/**
 * Service health status
 */
export type HealthStatus = "healthy" | "degraded" | "unhealthy"

/**
 * Health check response
 */
export interface HealthCheckResponse {
    readonly status: HealthStatus
    readonly timestamp: string
    readonly version: string
    readonly services: Record<string, ServiceHealth>
}

/**
 * Individual service health
 */
export interface ServiceHealth {
    readonly status: HealthStatus
    readonly responseTime?: number
    readonly message?: string
    readonly lastCheck: string
}
