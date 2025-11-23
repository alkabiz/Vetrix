export interface RefreshToken {
    id: string
    userId: number
    token: string
    expiresAt: Date
    createdAt: Date
    isRevoked: boolean
}

export interface LoginSession {
    id: string
    userId: number
    accessToken: string
    refreshToken: string
    ipAddress: string
    userAgent: string
    createdAt: Date
    lastActivity: Date
    isActive: boolean
}

export interface TwoFactorAuth {
    userId: number
    secret: string
    isEnabled: boolean
    backupCodes: string[]
    createdAt: Date
}

export interface SessionStore {
    get(sessionId: string): LoginSession | undefined
    set(sessionId: string, session: LoginSession): void
    delete(sessionId: string): void
    values(): IterableIterator<LoginSession>
    entries(): IterableIterator<[string, LoginSession]>
}

export interface TokenStore {
    get(token: string): RefreshToken | undefined
    set(token: string, refreshToken: RefreshToken): void
    delete(token: string): void
    values(): IterableIterator<RefreshToken>
    entries(): IterableIterator<[string, RefreshToken]>
}

export interface TwoFactorStore {
    get(userId: number): TwoFactorAuth | undefined
    set(userId: number, data: TwoFactorAuth): void
}
