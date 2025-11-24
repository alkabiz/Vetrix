export interface User {
    id: number
    username: string
    email: string
    role: string
}

import type { LoginSession, RefreshToken } from "./session"

export type { LoginSession, RefreshToken }

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
