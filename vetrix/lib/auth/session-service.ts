import crypto from "crypto"
import type { User } from "../types"
import type { LoginSession, SessionStore } from "./types/auth"
import { generateAccessToken, generateRefreshToken, blacklistToken, refreshTokens } from "./token-service"

// In-memory store (replace with Redis/DB in production)
export const loginSessions: SessionStore = new Map<string, LoginSession>()

export function createLoginSession(
    user: User,
    ipAddress: string,
    userAgent: string,
): { accessToken: string; refreshToken: string; sessionId: string } {
    const sessionId = crypto.randomUUID()
    const accessToken = generateAccessToken(user, sessionId)
    const refreshToken = generateRefreshToken(user.id)

    const session: LoginSession = {
        id: sessionId,
        userId: user.id,
        accessToken,
        refreshToken,
        ipAddress,
        userAgent,
        createdAt: new Date(),
        lastActivity: new Date(),
        isActive: true,
    }

    loginSessions.set(sessionId, session)
    console.debug(`[Auth] Session created: ${sessionId} for user ${user.id}`)

    return { accessToken, refreshToken, sessionId }
}

export function logout(sessionId: string): void {
    const session = loginSessions.get(sessionId)
    if (session) {
        blacklistToken(session.accessToken)

        // Revoke refresh token
        const refreshToken = refreshTokens.get(session.refreshToken)
        if (refreshToken) {
            refreshToken.isRevoked = true
        }

        session.isActive = false
        loginSessions.delete(sessionId)
        console.debug(`[Auth] Session terminated: ${sessionId}`)
    }
}

export function getUserSessions(userId: number): LoginSession[] {
    return Array.from(loginSessions.values()).filter((session) => session.userId === userId && session.isActive)
}

export function cleanupExpiredSessions(): void {
    const now = new Date()
    const expiredSessions: string[] = []

    for (const [sessionId, session] of loginSessions.entries()) {
        const inactiveTime = now.getTime() - session.lastActivity.getTime()
        if (inactiveTime > 24 * 60 * 60 * 1000) {
            // 24 hours
            expiredSessions.push(sessionId)
        }
    }

    expiredSessions.forEach((sessionId) => {
        const session = loginSessions.get(sessionId)
        if (session) {
            blacklistToken(session.accessToken)
            loginSessions.delete(sessionId)
            console.debug(`[Auth] Expired session cleaned: ${sessionId}`)
        }
    })

    // Cleanup expired refresh tokens
    for (const [token, refreshToken] of refreshTokens.entries()) {
        if (refreshToken.expiresAt < now || refreshToken.isRevoked) {
            refreshTokens.delete(token)
        }
    }
}
