import jwt from "jsonwebtoken"
import crypto from "crypto"
import type { User } from "./types/auth"
import { authConfig, VALID_ROLES } from "../config/config"
import { findUserById } from "../database/database-auth"
import type { RefreshToken, TokenStore } from "./types/auth"

// In-memory store for blacklisted tokens (replace with Redis/DB in production)
const blacklistedTokens = new Set<string>()

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
