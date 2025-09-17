import jwt from "jsonwebtoken"
import crypto from "crypto"
import type { User } from "./types"
import { authConfig, VALID_ROLES } from "./config"
import { findUserById } from "./mockData"

interface RefreshToken {
  id: string
  userId: number
  token: string
  expiresAt: Date
  createdAt: Date
  isRevoked: boolean
}

interface LoginSession {
  id: string
  userId: number
  accessToken: string
  refreshToken: string
  ipAddress: string
  userAgent: string
  createdAt: Date
  lastActivity: Date
  isActive: boolean
}

interface TwoFactorAuth {
  userId: number
  secret: string
  isEnabled: boolean
  backupCodes: string[]
  createdAt: Date
}

// In-memory stores (replace with database in production)
const refreshTokens = new Map<string, RefreshToken>()
const loginSessions = new Map<string, LoginSession>()
const twoFactorSecrets = new Map<number, TwoFactorAuth>()
const blacklistedTokens = new Set<string>()

export const validatePasswordPolicy = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 12) {
    errors.push("Password must be at least 12 characters long")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push("Password cannot contain repeated characters")
  }

  if (/123|abc|qwe|password|admin/i.test(password)) {
    errors.push("Password cannot contain common patterns")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

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

export function generateAccessToken(user: User): string {
  if (!VALID_ROLES.includes(user.role)) {
    throw new Error("Invalid user role")
  }

  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      type: "access",
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
    return null
  }

  const user = await findUserById(storedToken.userId)
  if (!user) {
    return null
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(user)
  const newRefreshToken = generateRefreshToken(user.id)

  // Revoke old refresh token
  storedToken.isRevoked = true

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  }
}

export function createLoginSession(
  user: User,
  ipAddress: string,
  userAgent: string,
): { accessToken: string; refreshToken: string; sessionId: string } {
  const sessionId = crypto.randomUUID()
  const accessToken = generateAccessToken(user)
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

  return { accessToken, refreshToken, sessionId }
}

export function blacklistToken(token: string): void {
  blacklistedTokens.add(token)
}

export function isTokenBlacklisted(token: string): boolean {
  return blacklistedTokens.has(token)
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

export function generateTwoFactorSecret(userId: number): { secret: string; qrCode: string } {
  const secret = crypto.randomBytes(20).toString("base32")
  const backupCodes = Array.from({ length: 10 }, () => crypto.randomBytes(4).toString("hex").toUpperCase())

  const twoFactor: TwoFactorAuth = {
    userId,
    secret,
    isEnabled: false,
    backupCodes,
    createdAt: new Date(),
  }

  twoFactorSecrets.set(userId, twoFactor)

  // Generate QR code URL (in production, use proper QR code library)
  const qrCode = `otpauth://totp/Vetrix:${userId}?secret=${secret}&issuer=Vetrix`

  return { secret, qrCode }
}

export function verifyTwoFactorCode(userId: number, code: string): boolean {
  const twoFactor = twoFactorSecrets.get(userId)
  if (!twoFactor || !twoFactor.isEnabled) {
    return false
  }

  // Simple TOTP verification (in production, use proper TOTP library)
  const timeStep = Math.floor(Date.now() / 30000)
  const expectedCode = crypto.createHmac("sha1", twoFactor.secret).update(timeStep.toString()).digest("hex").slice(-6)

  return code === expectedCode || twoFactor.backupCodes.includes(code.toUpperCase())
}

export function enableTwoFactor(userId: number, verificationCode: string): boolean {
  const twoFactor = twoFactorSecrets.get(userId)
  if (!twoFactor) {
    return false
  }

  if (verifyTwoFactorCode(userId, verificationCode)) {
    twoFactor.isEnabled = true
    return true
  }

  return false
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
    }
  })

  // Cleanup expired refresh tokens
  for (const [token, refreshToken] of refreshTokens.entries()) {
    if (refreshToken.expiresAt < now || refreshToken.isRevoked) {
      refreshTokens.delete(token)
    }
  }
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
  }
}

export function getUserSessions(userId: number): LoginSession[] {
  return Array.from(loginSessions.values()).filter((session) => session.userId === userId && session.isActive)
}

// Re-export existing functions
export * from "./auth"
