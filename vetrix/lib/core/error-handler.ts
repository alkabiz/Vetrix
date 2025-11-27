import { NextResponse } from "next/server"
import { ZodError } from "zod"

export enum ErrorCode {
    VALIDATION_ERROR = "VALIDATION_ERROR",
    AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
    AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
    NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
    INTERNAL_ERROR = "INTERNAL_ERROR",
    CONSTRAINT_ERROR = "CONSTRAINT_ERROR",
}

export class ApiError extends Error {
    constructor(
        public message: string,
        public statusCode: number,
        public code: string,
        public details?: unknown
    ) {
        super(message)
        this.name = "ApiError"
    }
}

export class ValidationError extends ApiError {
    constructor(message: string, details?: unknown) {
        super(message, 400, ErrorCode.VALIDATION_ERROR, details)
        this.name = "ValidationError"
    }
}

export class AuthenticationError extends ApiError {
    constructor(message = "Authentication required") {
        super(message, 401, ErrorCode.AUTHENTICATION_ERROR)
        this.name = "AuthenticationError"
    }
}

export class AuthorizationError extends ApiError {
    constructor(message = "Insufficient permissions") {
        super(message, 403, ErrorCode.AUTHORIZATION_ERROR)
        this.name = "AuthorizationError"
    }
}

export class NotFoundError extends ApiError {
    constructor(message = "Resource not found") {
        super(message, 404, ErrorCode.NOT_FOUND_ERROR)
        this.name = "NotFoundError"
    }
}

export function handleApiError(error: unknown): NextResponse {
    console.error("API Error:", error)

    if (error instanceof ApiError) {
        return NextResponse.json(
            {
                error: {
                    message: error.message,
                    code: error.code,
                    details: error.details,
                },
            },
            { status: error.statusCode }
        )
    }

    if (error instanceof ZodError) {
        return NextResponse.json(
            {
                error: {
                    message: "Validation failed",
                    code: ErrorCode.VALIDATION_ERROR,
                    details: error.errors,
                },
            },
            { status: 400 }
        )
    }

    // Database errors (SQLite specific)
    if (error instanceof Error && error.message.includes("SQLITE_CONSTRAINT")) {
        return NextResponse.json(
            {
                error: {
                    message: "Data constraint violation",
                    code: ErrorCode.CONSTRAINT_ERROR,
                },
            },
            { status: 400 }
        )
    }

    return NextResponse.json(
        {
            error: {
                message: "Internal server error",
                code: ErrorCode.INTERNAL_ERROR,
            },
        },
        { status: 500 }
    )
}

export function logRequest(request: Request, endpoint: string) {
    const timestamp = new Date().toISOString()
    const method = request.method
    const userAgent = request.headers.get("user-agent") || "Unknown"

    console.log(`[${timestamp}] ${method} ${endpoint} - User-Agent: ${userAgent}`)
}
