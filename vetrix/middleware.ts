import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, extractTokenFromRequest } from "@/lib/auth"

const protectedRoutes = {
  "/dashboard": { roles: ["admin", "vet", "assistant"] },
  "/dashboard/admin": { roles: ["admin"] },
  "/dashboard/medical": { roles: ["admin", "vet"] },
  "/dashboard/appointments": { roles: ["admin", "vet", "assistant"] },
  "/dashboard/tasks": { roles: ["admin", "vet", "assistant"] },
  "/users": { roles: ["admin"] },
  "/medical-records": { roles: ["admin", "vet"] },
  "/appointments": { roles: ["admin", "vet", "assistant"] },
  "/pets": { roles: ["admin", "vet", "assistant"] },
  "/owners": { roles: ["admin", "vet", "assistant"] },
  "/invoices": { roles: ["admin", "vet"] },
  "/api/users": { roles: ["admin"] },
  "/api/medical-records": { roles: ["admin", "vet"] },
  "/api/appointments": { roles: ["admin", "vet", "assistant"] },
  "/api/pets": { roles: ["admin", "vet", "assistant"] },
  "/api/owners": { roles: ["admin", "vet", "assistant"] },
  "/api/invoices": { roles: ["admin", "vet"] },
}

const getDashboardRedirect = (role: string): string => {
  switch (role) {
    case "admin":
      return "/dashboard/admin"
    case "vet":
      return "/dashboard/medical"
    case "assistant":
      return "/dashboard/appointments"
    default:
      return "/dashboard"
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/refresh") ||
    pathname.startsWith("/login") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next()
  }

  const token = extractTokenFromRequest(request) || request.cookies.get("auth-token")?.value

  if (!token) {
    // Redirect to login if no token
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const user = verifyToken(token)
  if (!user) {
    // Invalid token - redirect to login
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("auth-token")
    return response
  }

  if (pathname === "/" || pathname === "/dashboard") {
    const dashboardUrl = getDashboardRedirect(user.role)
    return NextResponse.redirect(new URL(dashboardUrl, request.url))
  }

  const routeConfig = Object.entries(protectedRoutes).find(([route]) => pathname.startsWith(route))?.[1]

  if (routeConfig && !routeConfig.roles.includes(user.role)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          error: "Insufficient permissions",
          required: routeConfig.roles,
          current: user.role,
        },
        { status: 403 },
      )
    }

    // Redirect to appropriate dashboard for unauthorized access
    const dashboardUrl = getDashboardRedirect(user.role)
    return NextResponse.redirect(new URL(dashboardUrl, request.url))
  }

  if (pathname.startsWith("/api/")) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", user.id.toString())
    requestHeaders.set("x-user-role", user.role)
    requestHeaders.set("x-user-email", user.email)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}