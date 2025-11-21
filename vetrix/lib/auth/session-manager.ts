import { sql } from "@/lib/database/database"
import { generateToken, verifyToken } from "."
import type { User } from "./types"
import crypto from "crypto"

export interface LoginSession {
  id: string
  user_id: number
  access_token: string
  refresh_token: string
  ip_address: string
  user_agent: string
  created_at: string
  last_activity: string
  expires_at: string
  is_active: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session_data?: Record<string, any>
}

export interface RefreshToken {
  id: string
  user_id: number
  token_hash: string
  expires_at: string
  created_at: string
  is_revoked: boolean
}

export async function createLoginSession(
  user: User,
  ipAddress: string,
  userAgent: string,
): Promise<{ accessToken: string; refreshToken: string; sessionId: string }> {
  const sessionId = crypto.randomUUID()
  const refreshToken = crypto.randomBytes(64).toString("hex")
  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

  const accessToken = generateToken(user)
  const now = new Date()
  const sessionExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours
  const refreshExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

  try {
    // Create session record
    await sql`
      INSERT INTO user_sessions (
        id, user_id, access_token, refresh_token, ip_address, user_agent,
        created_at, last_activity, expires_at, is_active
      ) VALUES (
        ${sessionId}, ${user.id}, ${accessToken}, ${refreshTokenHash}, ${ipAddress}, ${userAgent},
        ${now.toISOString()}, ${now.toISOString()}, ${sessionExpiry.toISOString()}, true
      )
    `

    // Create refresh token record
    await sql`
      INSERT INTO refresh_tokens (
        id, user_id, token_hash, expires_at, created_at, is_revoked
      ) VALUES (
        ${crypto.randomUUID()}, ${user.id}, ${refreshTokenHash}, 
        ${refreshExpiry.toISOString()}, ${now.toISOString()}, false
      )
    `

    return { accessToken, refreshToken, sessionId }
  } catch (error) {
    console.error("Error creating login session:", error)
    throw new Error("Failed to create session")
  }
}

export async function validateAndRefreshSession(token: string): Promise<{ user: User; newToken?: string } | null> {
  try {
    const user = verifyToken(token)
    if (!user) return null

    // Update last activity for the session
    await sql`
      UPDATE user_sessions 
      SET last_activity = ${new Date().toISOString()}
      WHERE access_token = ${token} AND is_active = true
    `

    // Check if token is close to expiry (within 5 minutes)
    const decoded = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    const expiryTime = decoded.exp * 1000
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000

    if (expiryTime - now < fiveMinutes) {
      // Generate new token
      const newToken = generateToken(user)

      // Update session with new token
      await sql`
        UPDATE user_sessions 
        SET access_token = ${newToken}, last_activity = ${new Date().toISOString()}
        WHERE access_token = ${token} AND is_active = true
      `

      return { user, newToken }
    }

    return { user }
  } catch (error) {
    console.error("Error validating session:", error)
    return null
  }
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

    // Find valid refresh token
    const tokenRecord = await sql`
      SELECT rt.*, u.id, u.username, u.email, u.role, u.created_at
      FROM refresh_tokens rt
      JOIN users u ON rt.user_id = u.id
      WHERE rt.token_hash = ${refreshTokenHash} 
        AND rt.is_revoked = false 
        AND rt.expires_at > ${new Date().toISOString()}
    `

    if (tokenRecord.length === 0) {
      return null
    }

    const user = {
      id: tokenRecord[0].id,
      username: tokenRecord[0].username,
      email: tokenRecord[0].email,
      role: tokenRecord[0].role,
      created_at: tokenRecord[0].created_at,
    }

    // Generate new tokens
    const newAccessToken = generateToken(user)
    const newRefreshToken = crypto.randomBytes(64).toString("hex")
    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex")

    // Revoke old refresh token and create new one
    await sql`
      UPDATE refresh_tokens 
      SET is_revoked = true 
      WHERE token_hash = ${refreshTokenHash}
    `

    await sql`
      INSERT INTO refresh_tokens (
        id, user_id, token_hash, expires_at, created_at, is_revoked
      ) VALUES (
        ${crypto.randomUUID()}, ${user.id}, ${newRefreshTokenHash}, 
        ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()}, 
        ${new Date().toISOString()}, false
      )
    `

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  } catch (error) {
    console.error("Error refreshing token:", error)
    return null
  }
}

export async function getUserSessions(userId: number): Promise<LoginSession[]> {
  try {
    const sessions = await sql`
      SELECT id, user_id, ip_address, user_agent, created_at, last_activity, expires_at, is_active
      FROM user_sessions
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY last_activity DESC
    `

    return sessions.map((session) => ({
      id: session.id,
      user_id: session.user_id,
      access_token: "", // Don't return actual token
      refresh_token: "", // Don't return actual token
      ip_address: session.ip_address,
      user_agent: session.user_agent,
      created_at: session.created_at,
      last_activity: session.last_activity,
      expires_at: session.expires_at,
      is_active: session.is_active,
    }))
  } catch (error) {
    console.error("Error fetching user sessions:", error)
    return []
  }
}

export async function terminateSession(sessionId: string, userId?: number): Promise<boolean> {
  try {
    let query = sql`
      UPDATE user_sessions 
      SET is_active = false, last_activity = ${new Date().toISOString()}
      WHERE id = ${sessionId}
    `

    if (userId) {
      query = sql`
        UPDATE user_sessions 
        SET is_active = false, last_activity = ${new Date().toISOString()}
        WHERE id = ${sessionId} AND user_id = ${userId}
      `
    }

    const result = await query
    return result.count > 0
  } catch (error) {
    console.error("Error terminating session:", error)
    return false
  }
}

export async function cleanupExpiredSessions(): Promise<void> {
  try {
    const now = new Date().toISOString()

    // Deactivate expired sessions
    await sql`
      UPDATE user_sessions 
      SET is_active = false 
      WHERE expires_at < ${now} OR last_activity < ${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}
    `

    // Revoke expired refresh tokens
    await sql`
      UPDATE refresh_tokens 
      SET is_revoked = true 
      WHERE expires_at < ${now}
    `

    // Delete old inactive sessions (older than 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    await sql`
      DELETE FROM user_sessions 
      WHERE is_active = false AND created_at < ${thirtyDaysAgo}
    `

    // Delete old revoked refresh tokens (older than 30 days)
    await sql`
      DELETE FROM refresh_tokens 
      WHERE is_revoked = true AND created_at < ${thirtyDaysAgo}
    `
  } catch (error) {
    console.error("Error cleaning up sessions:", error)
  }
}

export async function logoutSession(sessionId: string, userId: number): Promise<void> {
  try {
    // Get session to find associated refresh token
    const session = await sql`
      SELECT refresh_token FROM user_sessions 
      WHERE id = ${sessionId} AND user_id = ${userId}
    `

    if (session.length > 0) {
      // Revoke refresh token
      await sql`
        UPDATE refresh_tokens 
        SET is_revoked = true 
        WHERE token_hash = ${session[0].refresh_token}
      `
    }

    // Deactivate session
    await terminateSession(sessionId, userId)
  } catch (error) {
    console.error("Error during logout:", error)
    throw new Error("Failed to logout")
  }
}

export async function getCurrentSession(token: string): Promise<LoginSession | null> {
  try {
    const sessions = await sql`
      SELECT * FROM user_sessions 
      WHERE access_token = ${token} AND is_active = true
    `

    return sessions.length > 0 ? sessions[0] : null
  } catch (error) {
    console.error("Error getting current session:", error)
    return null
  }
}