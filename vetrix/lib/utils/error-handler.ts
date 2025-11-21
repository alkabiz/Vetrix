import { NextResponse } from "next/server"

export interface ApiError {
  message: string
  status: number
  code?: string
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ValidationError"
  }
}

export class AuthenticationError extends Error {
  constructor(message = "Authentication required") {
    super(message)
    this.name = "AuthenticationError"
  }
}

export class AuthorizationError extends Error {
  constructor(message = "Insufficient permissions") {
    super(message)
    this.name = "AuthorizationError"
  }
}

export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message)
    this.name = "NotFoundError"
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)

  if (error instanceof ValidationError) {
    return NextResponse.json({ error: error.message, code: "VALIDATION_ERROR" }, { status: 400 })
  }

  if (error instanceof AuthenticationError) {
    return NextResponse.json({ error: error.message, code: "AUTHENTICATION_ERROR" }, { status: 401 })
  }

  if (error instanceof AuthorizationError) {
    return NextResponse.json({ error: error.message, code: "AUTHORIZATION_ERROR" }, { status: 403 })
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: error.message, code: "NOT_FOUND_ERROR" }, { status: 404 })
  }

  // Database errors
  if (error instanceof Error && error.message.includes("SQLITE_CONSTRAINT")) {
    return NextResponse.json({ error: "Data constraint violation", code: "CONSTRAINT_ERROR" }, { status: 400 })
  }

  // Generic server error
  return NextResponse.json({ error: "Internal server error", code: "INTERNAL_ERROR" }, { status: 500 })
}

export function logRequest(request: Request, endpoint: string) {
  const timestamp = new Date().toISOString()
  const method = request.method
  const userAgent = request.headers.get("user-agent") || "Unknown"

  console.log(`[${timestamp}] ${method} ${endpoint} - User-Agent: ${userAgent}`)
}
