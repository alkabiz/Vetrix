
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
}

// Cookie names
const ACCESS_TOKEN_COOKIE = 'auth_token'
const REFRESH_TOKEN_COOKIE = 'refresh_token'
const CSRF_TOKEN_COOKIE = 'csrf_token'

/**
 * Get the access token from the request cookies
 */
export function getAccessToken(request: NextRequest): string | undefined {
  return request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
}

/**
 * Get the refresh token from the request cookies
 */
export function getRefreshToken(request: NextRequest): string | undefined {
  return request.cookies.get(REFRESH_TOKEN_COOKIE)?.value
}

/**
 * Set authentication cookies on the response
 */
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  csrfToken: string
) {
  // Set Access Token
  response.cookies.set({
    name: ACCESS_TOKEN_COOKIE,
    value: accessToken,
    ...COOKIE_OPTIONS,
    // Short lifetime for access token (e.g., 15 minutes)
    maxAge: 15 * 60, 
  })

  // Set Refresh Token
  response.cookies.set({
    name: REFRESH_TOKEN_COOKIE,
    value: refreshToken,
    ...COOKIE_OPTIONS,
    // Long lifetime for refresh token (e.g., 7 days)
    maxAge: 7 * 24 * 60 * 60,
  })

  // Set CSRF Token (readable by client JS if needed, but usually HttpOnly is safer if not using double submit)
  // For this implementation, we will make it NOT httpOnly if the client needs to read it for headers
  // But typically with Next.js actions/API, we might keep it HttpOnly and validate automatically.
  // However, the prompt implies "csrfToken" usage. Let's stick to HttpOnly unless we know otherwise.
  // Actually, standard CSRF protection often requires the client to send the token in a header.
  // So we'll make this one accessible to JS? Or use a separate "X-CSRF-Token" header?
  // Let's keep it consistent with the "secure" approach for now: HttpOnly.
  // If the client needs it, we can change it. 
  // Wait, `httpClient.ts` doesn't seem to read it.
  
  response.cookies.set({
    name: CSRF_TOKEN_COOKIE,
    value: csrfToken,
    ...COOKIE_OPTIONS,
    // Match refresh token lifetime
    maxAge: 7 * 24 * 60 * 60,
  })
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_TOKEN_COOKIE)
  response.cookies.delete(REFRESH_TOKEN_COOKIE)
  response.cookies.delete(CSRF_TOKEN_COOKIE)
}

/**
 * Generate a cryptographically strong random token for CSRF
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}
