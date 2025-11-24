import jwt from "jsonwebtoken"
import crypto from "crypto"
import type { User } from "./types/auth"
import { authConfig, VALID_ROLES } from "../config/config"
import { findUserById } from "../database/database-auth"
import type { RefreshToken, TokenStore } from "./types/auth"

// In-memory store (replace with Redis/DB in production)
export const refreshTokens: TokenStore = new Map<string, RefreshToken>()
const blacklistedTokens = new Set<string>()

export function generateRefreshToken(userId: number): string {
    const tokenId = crypto.randomUUID()
    const token = crypto.randomBytes(64).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const refreshToken: RefreshToken = {
        id: tokenId,
        userId,
        token,
        expiresAt,
        createdAt: new Date(),
        isRevoked: false,
    }

    refreshTokens.set(token, refreshToken)
    return token
}

export function generateAccessToken(user: User, sessionId?: string): string {
    if (!VALID_ROLES.includes(user.role as any)) {
        throw new Error("Invalid user role")
    }

    const jti = crypto.randomUUID()

    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            type: "access",
            jti,
            sid: sessionId,
        },
        authConfig.JWT_SECRET,
        { expiresIn: "15m" }, // Short-lived access tokens
    )
}

export async function refreshAccessToken(
    refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string } | null> {
    const storedToken = refreshTokens.get(refreshToken)

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
        console.debug(`[Auth] Refresh failed: Invalid or expired token ${refreshToken.slice(0, 8)}...`)
        return null
    }

    const user = await findUserById(storedToken.userId)
    if (!user) {
        console.debug(`[Auth] Refresh failed: User ${storedToken.userId} not found`)
        return null
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken(user.id)

    // Revoke old refresh token
    storedToken.isRevoked = true
    console.debug(`[Auth] Token refreshed for user ${user.id}`)

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    }
}

export function blacklistToken(token: string): void {
    try {
        const decoded = jwt.decode(token) as { jti?: string } | null
        if (decoded?.jti) {
            blacklistedTokens.add(decoded.jti)
        } else {
            // Fallback for tokens without jti (legacy)
            blacklistedTokens.add(token)
        }
    } catch (error) {
        console.error("[Auth] Failed to blacklist token:", error)
    }
}

export function isTokenBlacklisted(token: string): boolean {
    try {
        const decoded = jwt.decode(token) as { jti?: string } | null
        if (decoded?.jti && blacklistedTokens.has(decoded.jti)) {
            return true
        }
        return blacklistedTokens.has(token)
    } catch {
        return true // Fail safe
    }
}

export function verifyAccessToken(token: string): User | null {
    try {
        if (isTokenBlacklisted(token)) {
            return null
        }

        const decoded = jwt.verify(token, authConfig.JWT_SECRET) as any

        if (decoded.type !== "access" || !VALID_ROLES.includes(decoded.role)) {
            return null
        }

        return {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
        }
    } catch (error) {
        return null
    }
}
