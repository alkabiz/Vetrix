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

export interface SessionCreateData {
    userId: number
    accessToken: string
    refreshTokenHash: string
    ipAddress: string
    userAgent: string
    sessionExpiry: Date
}

export interface RefreshTokenCreateData {
    userId: number
    tokenHash: string
    expiresAt: Date
}
