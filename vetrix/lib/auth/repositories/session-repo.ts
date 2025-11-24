import { sql } from "@/lib/database/database"
import type { LoginSession, RefreshToken, SessionCreateData, RefreshTokenCreateData } from "../types/session"

export const sessionRepo = {
    async insertSession(data: SessionCreateData): Promise<string> {
        const sessionId = crypto.randomUUID()
        const now = new Date().toISOString()

        await sql`
      INSERT INTO user_sessions (
        id, user_id, access_token, refresh_token, ip_address, user_agent,
        created_at, last_activity, expires_at, is_active
      ) VALUES (
        ${sessionId}, ${data.userId}, ${data.accessToken}, ${data.refreshTokenHash}, 
        ${data.ipAddress}, ${data.userAgent},
        ${now}, ${now}, ${data.sessionExpiry.toISOString()}, true
      )
    `
        return sessionId
    },

    async findSessionByAccessToken(accessToken: string): Promise<LoginSession | null> {
        const sessions = await sql`
      SELECT * FROM user_sessions 
      WHERE access_token = ${accessToken} AND is_active = true
    `
        return sessions.length > 0 ? (sessions[0] as LoginSession) : null
    },

    async findSessionById(sessionId: string): Promise<LoginSession | null> {
        const sessions = await sql`
      SELECT * FROM user_sessions 
      WHERE id = ${sessionId}
    `
        return sessions.length > 0 ? (sessions[0] as LoginSession) : null
    },

    async updateSessionActivity(sessionId: string): Promise<void> {
        await sql`
      UPDATE user_sessions 
      SET last_activity = ${new Date().toISOString()}
      WHERE id = ${sessionId}
    `
    },

    async updateSessionToken(sessionId: string, newAccessToken: string): Promise<void> {
        await sql`
      UPDATE user_sessions 
      SET access_token = ${newAccessToken}, last_activity = ${new Date().toISOString()}
      WHERE id = ${sessionId}
    `
    },

    async deactivateSession(sessionId: string): Promise<void> {
        await sql`
      UPDATE user_sessions 
      SET is_active = false, last_activity = ${new Date().toISOString()}
      WHERE id = ${sessionId}
    `
    },

    async getUserSessions(userId: number): Promise<LoginSession[]> {
        const sessions = await sql`
      SELECT * FROM user_sessions
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY last_activity DESC
      LIMIT 50
    `
        return sessions as LoginSession[]
    },

    async insertRefreshToken(data: RefreshTokenCreateData): Promise<string> {
        const id = crypto.randomUUID()
        const now = new Date().toISOString()

        await sql`
      INSERT INTO refresh_tokens (
        id, user_id, token_hash, expires_at, created_at, is_revoked
      ) VALUES (
        ${id}, ${data.userId}, ${data.tokenHash}, 
        ${data.expiresAt.toISOString()}, ${now}, false
      )
    `
        return id
    },

    async findRefreshToken(tokenHash: string): Promise<(RefreshToken & { username: string; email: string; role: string }) | null> {
        const tokens = await sql`
      SELECT rt.*, u.username, u.email, u.role
      FROM refresh_tokens rt
      JOIN users u ON rt.user_id = u.id
      WHERE rt.token_hash = ${tokenHash}
    `
        return tokens.length > 0 ? (tokens[0] as any) : null
    },

    async revokeRefreshToken(tokenHash: string): Promise<void> {
        await sql`
      UPDATE refresh_tokens 
      SET is_revoked = true 
      WHERE token_hash = ${tokenHash}
    `
    },

    async cleanupExpired(): Promise<void> {
        const now = new Date().toISOString()
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

        // Deactivate expired sessions
        await sql`
      UPDATE user_sessions 
      SET is_active = false 
      WHERE expires_at < ${now} OR last_activity < ${oneDayAgo}
    `

        // Revoke expired refresh tokens
        await sql`
      UPDATE refresh_tokens 
      SET is_revoked = true 
      WHERE expires_at < ${now}
    `

        // Delete old data
        await sql`
      DELETE FROM user_sessions 
      WHERE is_active = false AND created_at < ${thirtyDaysAgo}
    `
        await sql`
      DELETE FROM refresh_tokens 
      WHERE is_revoked = true AND created_at < ${thirtyDaysAgo}
    `
    }
}
