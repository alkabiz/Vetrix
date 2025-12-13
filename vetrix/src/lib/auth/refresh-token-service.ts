
import pool from "@/lib/db"
import { RowDataPacket, ResultSetHeader } from "mysql2"
import crypto from "crypto"

export interface RefreshToken extends RowDataPacket {
    id: number
    userId: number
    token: string
    expiresAt: Date
    createdAt: Date
    revokedAt: Date | null
    replacedByToken: string | null
    deviceInfo: string | null
    ipAddress: string | null
}

export interface CreateRefreshTokenParams {
    userId: number
    token: string
    expiresAt: Date
    deviceInfo?: string
    ipAddress?: string
}

/**
 * Find a refresh token by its value
 */
export async function findRefreshToken(token: string): Promise<RefreshToken | null> {
    const [rows] = await pool.query<RefreshToken[]>(
        `SELECT 
            id, 
            user_id as userId, 
            token, 
            expires_at as expiresAt, 
            created_at as createdAt, 
            revoked_at as revokedAt, 
            replaced_by_token as replacedByToken,
            device_info as deviceInfo,
            ip_address as ipAddress
         FROM usr_refresh_tokens 
         WHERE token = ?`,
        [token]
    )
    return rows[0] || null
}

/**
 * Create a new refresh token
 */
export async function createRefreshToken(params: CreateRefreshTokenParams): Promise<RefreshToken> {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO usr_refresh_tokens (
            user_id, 
            token, 
            expires_at, 
            device_info, 
            ip_address
        ) VALUES (?, ?, ?, ?, ?)`,
        [
            params.userId,
            params.token,
            params.expiresAt,
            params.deviceInfo || null,
            params.ipAddress || null
        ]
    )

    return {
        id: result.insertId,
        ...params,
        createdAt: new Date(),
        revokedAt: null,
        replacedByToken: null,
    } as RefreshToken
}

/**
 * Revoke a refresh token
 */
export async function revokeRefreshToken(id: number, replacedByToken?: string): Promise<void> {
    await pool.query(
        `UPDATE usr_refresh_tokens 
         SET revoked_at = NOW(), 
             replaced_by_token = ? 
         WHERE id = ?`,
        [replacedByToken || null, id]
    )
}

/**
 * Revoke all refresh tokens for a user
 */
export async function revokeAllUserTokens(userId: number): Promise<void> {
    await pool.query(
        `UPDATE usr_refresh_tokens 
         SET revoked_at = NOW() 
         WHERE user_id = ? AND revoked_at IS NULL`,
        [userId]
    )
}

/**
 * Generate a random refresh token string
 */
export function generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex')
}
