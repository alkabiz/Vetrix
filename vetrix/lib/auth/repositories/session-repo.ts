import { getDatabase } from "@/lib/database/database"
import type { LoginSession, RefreshToken, SessionCreateData, RefreshTokenCreateData } from "../types/session"
import crypto from "crypto"

export const sessionRepo = {
    insertSession(data: SessionCreateData): string {
        const sessionId = crypto.randomUUID()
        const now = new Date().toISOString()
        const db = getDatabase()

        const stmt = db.prepare(`
      INSERT INTO user_sessions (
        id, user_id, access_token, refresh_token, ip_address, user_agent,
        created_at, last_activity, expires_at, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

        stmt.run(
            sessionId,
            data.userId,
            data.accessToken,
            data.refreshTokenHash,
            data.ipAddress,
            data.userAgent,
            now,
            now,
            data.sessionExpiry.toISOString(),
            1 // true
        )

        return sessionId
    },

    findSessionByAccessToken(accessToken: string): LoginSession | null {
        const db = getDatabase()
        const stmt = db.prepare(`
      SELECT * FROM user_sessions 
      WHERE access_token = ? AND is_active = 1
    `)
        const session = stmt.get(accessToken) as LoginSession | undefined
        return session || null
    },

    findSessionById(sessionId: string): LoginSession | null {
        const db = getDatabase()
        const stmt = db.prepare(`
      SELECT * FROM user_sessions 
      WHERE id = ?
    `)
        const session = stmt.get(sessionId) as LoginSession | undefined
        return session || null
    },

    updateSessionActivity(sessionId: string): void {
        const db = getDatabase()
        const stmt = db.prepare(`
      UPDATE user_sessions 
      SET last_activity = ?
      WHERE id = ?
    `)
        stmt.run(new Date().toISOString(), sessionId)
    },

    updateSessionToken(sessionId: string, newAccessToken: string): void {
        const db = getDatabase()
        const stmt = db.prepare(`
      UPDATE user_sessions 
      SET access_token = ?, last_activity = ?
      WHERE id = ?
    `)
        stmt.run(newAccessToken, new Date().toISOString(), sessionId)
    },

    deactivateSession(sessionId: string): void {
        const db = getDatabase()
        const stmt = db.prepare(`
      UPDATE user_sessions 
      SET is_active = 0, last_activity = ?
      WHERE id = ?
    `)
        stmt.run(new Date().toISOString(), sessionId)
    },

    getUserSessions(userId: number): LoginSession[] {
        const db = getDatabase()
        const stmt = db.prepare(`
      SELECT * FROM user_sessions
      WHERE user_id = ? AND is_active = 1
      ORDER BY last_activity DESC
      LIMIT 50
    `)
        return stmt.all(userId) as LoginSession[]
    },

    insertRefreshToken(data: RefreshTokenCreateData): string {
        const id = crypto.randomUUID()
        const now = new Date().toISOString()
        const db = getDatabase()

        const stmt = db.prepare(`
      INSERT INTO refresh_tokens (
        id, user_id, token_hash, expires_at, created_at, is_revoked
      ) VALUES (?, ?, ?, ?, ?, ?)
    `)

        stmt.run(
            id,
            data.userId,
            data.tokenHash,
            data.expiresAt.toISOString(),
            now,
            0 // false
        )
        return id
    },

    findRefreshToken(tokenHash: string): (RefreshToken & { username: string; email: string; role: string }) | null {
        const db = getDatabase()
        const stmt = db.prepare(`
      SELECT rt.*, u.username, u.email, u.role
      FROM refresh_tokens rt
      JOIN usr_users u ON rt.user_id = u.id
      WHERE rt.token_hash = ?
    `)
        const token = stmt.get(tokenHash) as any
        return token || null
    },

    revokeRefreshToken(tokenHash: string): void {
        const db = getDatabase()
        const stmt = db.prepare(`
      UPDATE refresh_tokens 
      SET is_revoked = 1 
      WHERE token_hash = ?
    `)
        stmt.run(tokenHash)
    },

    cleanupExpired(): void {
        const now = new Date().toISOString()
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        const db = getDatabase()

        // Deactivate expired sessions
        const stmt1 = db.prepare(`
      UPDATE user_sessions 
      SET is_active = 0 
      WHERE expires_at < ? OR last_activity < ?
    `)
        stmt1.run(now, oneDayAgo)

        // Revoke expired refresh tokens
        const stmt2 = db.prepare(`
      UPDATE refresh_tokens 
      SET is_revoked = 1 
      WHERE expires_at < ?
    `)
        stmt2.run(now)

        // Delete old data
        const stmt3 = db.prepare(`
      DELETE FROM user_sessions 
      WHERE is_active = 0 AND created_at < ?
    `)
        stmt3.run(thirtyDaysAgo)

        const stmt4 = db.prepare(`
      DELETE FROM refresh_tokens 
      WHERE is_revoked = 1 AND created_at < ?
    `)
        stmt4.run(thirtyDaysAgo)
    }
}
