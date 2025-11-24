export class SessionError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "SessionError"
    }
}

export class SessionExpiredError extends SessionError {
    constructor(message = "Session has expired") {
        super(message)
        this.name = "SessionExpiredError"
    }
}

export class InvalidTokenError extends SessionError {
    constructor(message = "Invalid token provided") {
        super(message)
        this.name = "InvalidTokenError"
    }
}

export class RefreshTokenRevokedError extends SessionError {
    constructor(message = "Refresh token has been revoked") {
        super(message)
        this.name = "RefreshTokenRevokedError"
    }
}

export class SessionNotFoundError extends SessionError {
    constructor(message = "Session not found") {
        super(message)
        this.name = "SessionNotFoundError"
    }
}
