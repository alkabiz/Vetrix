import crypto from "crypto"
import { sessionRepo } from "./repositories/session-repo"
import { generateAccessToken, verifyAccessToken } from "./token-service"
import {
    SessionExpiredError,
    InvalidTokenError,
    RefreshTokenRevokedError,
    SessionNotFoundError
} from "./errors/session-errors"
import type { User } from "./types/auth"
import type { LoginSession } from "./types/session"

export const sessionService = {
    async createLoginSession(
        user: User,
        ipAddress: string,
        userAgent: string
    ): Promise<{ accessToken: string; refreshToken: string; sessionId: string }> {
        const sessionId = crypto.randomUUID()

        // Generate tokens
        const accessToken = generateAccessToken(user, sessionId)
        const refreshToken = crypto.randomBytes(64).toString("hex")

        // Hash refresh token for storage (SHA-512)
        const refreshTokenHash = crypto
            .createHash("sha512")
            .update(refreshToken)
            .digest("hex")

        const now = new Date()
        const sessionExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours
        const refreshExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

        try {
            // Create session in DB
            await sessionRepo.insertSession({
                userId: user.id,
                accessToken,
                refreshTokenHash,
                ipAddress,
                userAgent,
                sessionExpiry
            })

            // Store refresh token
            await sessionRepo.insertRefreshToken({
                userId: user.id,
                tokenHash: refreshTokenHash,
                expiresAt: refreshExpiry
            })

            console.log(`[Auth] Session created: ${sessionId} for user ${user.id}`)

            return { accessToken, refreshToken, sessionId }
        } catch (error) {
            console.error("[Auth] Failed to create session:", error)
            throw new Error("Failed to create session")
        }
    },

    async validateAndRefreshSession(accessToken: string): Promise<{ user: User; newToken?: string } | null> {
        try {
            // 1. Verify JWT signature and expiry
            const user = verifyAccessToken(accessToken)
            if (!user) {
                // If JWT is invalid/expired, check if we have a session to refresh?
                // Usually validateSession is for active access tokens.
                // If expired, client should call refreshAccessToken.
                throw new InvalidTokenError()
            }

            // 2. Check if session exists and is active in DB
            const session = await sessionRepo.findSessionByAccessToken(accessToken)
            if (!session || !session.is_active) {
                throw new SessionNotFoundError()
            }

            // 3. Update last activity
            await sessionRepo.updateSessionActivity(session.id)

            // 4. Check if token needs rotation (e.g. < 5 min remaining)
            // verifyAccessToken returns User, doesn't give exp. 
            // We can decode to check exp.
            const decoded = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString())
            const expiryTime = decoded.exp * 1000
            const now = Date.now()
            const fiveMinutes = 5 * 60 * 1000

            if (expiryTime - now < fiveMinutes) {
                const newToken = generateAccessToken(user, session.id)
                await sessionRepo.updateSessionToken(session.id, newToken)
                return { user, newToken }
            }

            return { user }
        } catch (error) {
            if (error instanceof InvalidTokenError) return null
            console.error("[Auth] Validate session error:", error)
            return null
        }
    },

    async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        const refreshTokenHash = crypto
            .createHash("sha512")
            .update(refreshToken)
            .digest("hex")

        const tokenRecord = await sessionRepo.findRefreshToken(refreshTokenHash)

        if (!tokenRecord) {
            throw new InvalidTokenError("Invalid refresh token")
        }

        if (tokenRecord.is_revoked) {
            // Security: Token reuse detection could go here (revoke all user sessions)
            throw new RefreshTokenRevokedError()
        }
    async terminateSession(sessionId: string): Promise < void> {
            await sessionRepo.deactivateSession(sessionId)
        console.log(`[Auth] Session terminated: ${sessionId}`)
        },

            async cleanupExpiredSessions(): Promise < void> {
                await sessionRepo.cleanupExpired()
        console.log("[Auth] Cleaned up expired sessions")
            },

                async logoutSession(sessionId: string): Promise < void> {
                    const session = await sessionRepo.findSessionById(sessionId)
        if(session) {
                        // Revoke refresh token
                        await sessionRepo.revokeRefreshToken(session.refresh_token)
                        // Deactivate session
                        await sessionRepo.deactivateSession(sessionId)
                        console.log(`[Auth] Logout session: ${sessionId}`)
                    }
                },

                    async getCurrentSession(accessToken: string): Promise < LoginSession | null > {
                        return sessionRepo.findSessionByAccessToken(accessToken)
                    }
    }
