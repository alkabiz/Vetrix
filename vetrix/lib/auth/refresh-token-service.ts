/**
 * @fileoverview Refresh token service for managing refresh tokens
 * @module lib/auth/refresh-token-service
 */

import { getDatabase } from '@/lib/database/database'
import type { RefreshToken, CreateRefreshTokenPayload } from '@/lib/api/types/auth.types'
import crypto from 'crypto'

/**
 * Create a new refresh token
 */
export async function createRefreshToken(payload: CreateRefreshTokenPayload): Promise<RefreshToken> {
    const db = getDatabase()
    const id = crypto.randomUUID()
    const hashedToken = hashToken(payload.token)

    const stmt = db.prepare(`
    INSERT INTO usr_refresh_tokens (
      id, userId, token, expiresAt, deviceInfo, ipAddress, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `)

    stmt.run(
        id,
        payload.userId,
        hashedToken,
        payload.expiresAt.toISOString(),
        payload.deviceInfo || null,
        payload.ipAddress || null
    )

    return {
        id,
        userId: payload.userId,
        token: hashedToken,
        expiresAt: payload.expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
        revokedAt: null,
        replacedByToken: null,
        deviceInfo: payload.deviceInfo || null,
        ipAddress: payload.ipAddress || null,
    }
}

/**
 * Find refresh token by token value
 */
export async function findRefreshToken(token: string): Promise<RefreshToken | null> {
    const db = getDatabase()
    const hashedToken = hashToken(token)

    const stmt = db.prepare(`
    SELECT * FROM usr_refresh_tokens
    WHERE token = ? AND revokedAt IS NULL AND datetime(expiresAt) > datetime('now')
  `)

    const row = stmt.get(hashedToken) as RefreshToken | undefined

    return row || null
}

/**
 * Revoke a refresh token
 */
export async function revokeRefreshToken(
    tokenId: string,
    replacedByToken?: string
): Promise<void> {
    const db = getDatabase()

    const stmt = db.prepare(`
    UPDATE usr_refresh_tokens
    SET revokedAt = datetime('now'), replacedByToken = ?
    WHERE id = ?
  `)

    stmt.run(replacedByToken || null, tokenId)
}

/**
 * Revoke all refresh tokens for a user
 */
export async function revokeAllUserTokens(userId: number): Promise<void> {
    const db = getDatabase()

    const stmt = db.prepare(`
    UPDATE usr_refresh_tokens
    SET revokedAt = datetime('now')
    WHERE userId = ? AND revokedAt IS NULL
  `)

    stmt.run(userId)
}

/**
 * Clean up expired tokens (run periodically)
 */
export async function cleanupExpiredTokens(): Promise<number> {
    const db = getDatabase()

    const stmt = db.prepare(`
    DELETE FROM usr_refresh_tokens
    WHERE datetime(expiresAt) < datetime('now', '-30 days')
  `)

    const result = stmt.run()
    return result.changes
}

/**
 * Hash token for storage (simple hash, consider bcrypt for production)
 */
function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Generate a cryptographically secure random token
 */
export function generateRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex')
}
