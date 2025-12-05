/**
 * @fileoverview Token refresh endpoint with HttpOnly cookies
 * Exchanges a valid refresh token for a new access token
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateAccessToken } from '@/lib/auth/token-service'
import {
  getRefreshToken,
  setAuthCookies,
  generateCSRFToken
} from '@/lib/auth/cookie-utils'
import {
  findRefreshToken,
  revokeRefreshToken,
  createRefreshToken,
  generateRefreshToken as genRefreshToken
} from '@/lib/auth/refresh-token-service'
import { AuthErrorCode, TOKEN_LIFETIMES } from '@/lib/api/types/auth.types'
import { findUserById } from '@/lib/auth/auth'
import { handleApiError, logRequest } from '@/lib/core/error-handler'

export async function POST(request: NextRequest) {
  try {
    logRequest(request, '/api/auth/refresh')

    // Get refresh token from HttpOnly cookie
    const refreshTokenValue = getRefreshToken(request)

    if (!refreshTokenValue) {
      return NextResponse.json(
        {
          error: 'Refresh token missing',
          code: AuthErrorCode.TOKEN_MISSING,
        },
        { status: 401 }
      )
    }

    // Verify the refresh token is valid and not expired
    const storedToken = await findRefreshToken(refreshTokenValue)

    if (!storedToken) {
      return NextResponse.json(
        {
          error: 'Invalid or expired refresh token',
          code: AuthErrorCode.REFRESH_TOKEN_INVALID,
        },
        { status: 401 }
      )
    }

    // Get the user
    const user = await findUserById(storedToken.userId)

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
          code: AuthErrorCode.INVALID_CREDENTIALS,
        },
        { status: 401 }
      )
    }

    // Check if user account is locked or disabled
    if (user.statusId !== 1) {
      return NextResponse.json(
        {
          error: 'Account is disabled',
          code: AuthErrorCode.ACCOUNT_DISABLED,
        },
        { status: 403 }
      )
    }

    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return NextResponse.json(
        {
          error: 'Account is locked',
          code: AuthErrorCode.ACCOUNT_LOCKED,
        },
        { status: 403 }
      )
    }

    // Remove password from user object
    const { passwordHash, ...userWithoutPassword } = user

    // Prepare user data for token generation (needs role field)
    const userForToken = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: (user.roleId === 1 ? 'admin' : user.roleId === 2 ? 'vet' : 'assistant') as 'admin' | 'vet' | 'assistant'
    }

    // Generate new access token
    const accessToken = generateAccessToken(userForToken)

    // Implement refresh token rotation for security
    // Revoke the old refresh token
    await revokeRefreshToken(storedToken.id)

    // Create new refresh token
    const newRefreshTokenValue = genRefreshToken()
    const refreshExpiresAt = new Date(Date.now() + TOKEN_LIFETIMES.REFRESH_TOKEN * 1000)

    const newRefreshToken = await createRefreshToken({
      userId: user.id,
      token: newRefreshTokenValue,
      expiresAt: refreshExpiresAt,
      deviceInfo: request.headers.get('user-agent') || undefined,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
    })

    // Mark old token as replaced
    await revokeRefreshToken(storedToken.id, newRefreshToken.id)

    // Generate CSRF token
    const csrfToken = generateCSRFToken()

    // Calculate access token expiration
    const accessExpiresAt = new Date(Date.now() + TOKEN_LIFETIMES.ACCESS_TOKEN * 1000)

    // Set new cookies
    const response = NextResponse.json({
      message: 'Token refreshed successfully',
      expiresAt: accessExpiresAt.toISOString(),
    })

    setAuthCookies(response, accessToken, newRefreshTokenValue, csrfToken)

    return response
  } catch (error) {
    return handleApiError(error)
  }
}