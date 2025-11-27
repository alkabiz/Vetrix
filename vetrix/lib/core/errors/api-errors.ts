export class AppError extends Error {
    public readonly statusCode: number
    public readonly code: string

    constructor(message: string, statusCode: number, code: string) {
        super(message)
        this.statusCode = statusCode
        this.code = code
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400, "VALIDATION_ERROR")
    }
}

export class AuthenticationError extends AppError {
    constructor(message = "Authentication required") {
        super(message, 401, "AUTHENTICATION_ERROR")
    }
}

export class AuthorizationError extends AppError {
    constructor(message = "Insufficient permissions") {
        super(message, 403, "AUTHORIZATION_ERROR")
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404, "NOT_FOUND_ERROR")
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, "CONFLICT_ERROR")
    }
}
