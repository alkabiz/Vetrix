import { sessionService } from "./session-service"
import type { User } from "./types/auth"
import type { LoginSession, RefreshToken } from "./types/session"

export type { LoginSession, RefreshToken }

export async function createLoginSession(
  user: User,
  ipAddress: string,
  userAgent: string,
): Promise<{ accessToken: string; refreshToken: string; sessionId: string }> {
  return sessionService.createLoginSession(user, ipAddress, userAgent)
}

export async function validateAndRefreshSession(token: string): Promise<{ user: User; newToken?: string } | null> {
  return sessionService.validateAndRefreshSession(token)
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    return await sessionService.refreshAccessToken(refreshToken)
  } catch (error) {
    console.error("Error refreshing token:", error)
    return null
  }
}

export async function getUserSessions(userId: number): Promise<LoginSession[]> {
  return sessionService.getUserSessions(userId)
}

export async function terminateSession(sessionId: string, userId?: number): Promise<boolean> {
  try {
    // Note: userId is not used in the new service for termination, but kept for compatibility signature
    await sessionService.terminateSession(sessionId)
    return true
  } catch (error) {
    return false
  }
}

export async function cleanupExpiredSessions(): Promise<void> {
  return sessionService.cleanupExpiredSessions()
}

export async function logoutSession(sessionId: string, userId: number): Promise<void> {
  // Note: userId is not used in the new service for logout, but kept for compatibility signature
  return sessionService.logoutSession(sessionId)
}

export async function getCurrentSession(token: string): Promise<LoginSession | null> {
  return sessionService.getCurrentSession(token)
}