import { type NextRequest, NextResponse } from "next/server"

/**
 * Lightweight proxy for Next.js 16
 * - Only checks for session cookie existence
 * - Redirects to login if missing
 * - Heavy JWT verification happens in API routes
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes - always allow through
  const publicRoutes = [
    "/login",
    "/register",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/refresh",
    "/api/auth/verify",
  ]

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Static files and Next.js internals - always allow
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next()
  }

  // Check for auth token cookie (lightweight check only)
  const authToken = request.cookies.get("auth-token")?.value

  if (!authToken) {
    // No token - redirect to login
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Token exists - allow through
  // Actual JWT verification and role checks will happen in:
  // - React Server Components
  // - API route handlers
  // - Via /api/auth/verify endpoint

  return NextResponse.next()
}

// Configure which routes the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}