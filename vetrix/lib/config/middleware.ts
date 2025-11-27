import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, extractTokenFromRequest, hasPermission } from "../auth"
import { getUserPermissions } from "../database/database-auth"
import type { RoleName } from "../core/types"

// Tipo para el contexto de autenticación
export interface AuthContext {
  user: {
    id: number
    username: string
    email: string
    role: RoleName
    created_at?: string
  }
  permissions: string[]
  params?: Record<string, string> // Support for Next.js dynamic route params
}

// Tipo para handlers autenticados - compatible with Next.js route handlers
export type AuthenticatedHandler<TContext = AuthContext> = (
  request: NextRequest,
  context: TContext
) => Promise<NextResponse>

// Manejo centralizado de errores
const createErrorResponse = (message: string, status: number) => {
  console.error(`Auth Error (${status}):`, message)
  return NextResponse.json({ error: message }, { status })
}

export function withAuth<TContext extends { params?: Record<string, string> } = AuthContext>(
  handler: AuthenticatedHandler<TContext & AuthContext>
) {
  return async (request: NextRequest, context?: TContext): Promise<NextResponse> => {
    try {
      const token =
        extractTokenFromRequest(request) ||
        request.headers.get("x-auth-token") ||
        request.cookies.get("auth-token")?.value

      if (!token) {
        return createErrorResponse("Se requiere token de autorización", 401)
      }

      const user = verifyToken(token)

      if (!user) {
        return createErrorResponse("Token no válido o caducado", 401)
      }

      const permissions = await getUserPermissions(user.id)

      // Merge Next.js context (with params) and authentication context
      const authContext = {
        user,
        permissions,
        ...context // Preserve params and any other Next.js context
      } as TContext & AuthContext

      return handler(request, authContext)
    } catch (error) {
      console.error("Error de middleware de autenticación:", error)
      return createErrorResponse("Error en la autenticación", 401)
    }
  }
}

// Middleware de autorización por roles
export function withRole<TContext extends { params?: Record<string, string> } = AuthContext>(
  allowedRoles: RoleName[]
) {
  return (handler: AuthenticatedHandler<TContext & AuthContext>) =>
    withAuth<TContext>(async (request: NextRequest, context: TContext & AuthContext) => {
      const { user } = context

      if (!allowedRoles.includes(user.role)) {
        return createErrorResponse(`Acceso denegado. Funciones requeridas: ${allowedRoles.join(", ")}`, 403)
      }

      return handler(request, context)
    })
}

export function withPermission<TContext extends { params?: Record<string, string> } = AuthContext>(
  requiredPermission: string
) {
  return (handler: AuthenticatedHandler<TContext & AuthContext>) =>
    withAuth<TContext>(async (request: NextRequest, context: TContext & AuthContext) => {
      const { user, permissions } = context

      // Check both role-based and database permissions
      const hasRolePermission = hasPermission(user.role, requiredPermission)
      const hasDbPermission = permissions.includes(requiredPermission)

      if (!hasRolePermission && !hasDbPermission) {
        return createErrorResponse(`Permisos insuficientes. Requerido: ${requiredPermission}`, 403)
      }

      return handler(request, context)
    })
}

export function withAnyPermission<TContext extends { params?: Record<string, string> } = AuthContext>(
  requiredPermissions: string[]
) {
  return (handler: AuthenticatedHandler<TContext & AuthContext>) =>
    withAuth<TContext>(async (request: NextRequest, context: TContext & AuthContext) => {
      const { user, permissions } = context

      const hasAnyPermission = requiredPermissions.some(
        (permission) => hasPermission(user.role, permission) || permissions.includes(permission),
      )

      if (!hasAnyPermission) {
        return createErrorResponse(`Permisos insuficientes. Requerido uno de: ${requiredPermissions.join(", ")}`, 403)
      }

      return handler(request, context)
    })
}

// Shortcuts de middleware más legibles - now generic for dynamic routes
export const requireAdmin = <TContext extends { params?: Record<string, string> } = AuthContext>(
  handler: AuthenticatedHandler<TContext & AuthContext>
) => withRole<TContext>(["admin"])(handler)

export const requireVetOrAdmin = <TContext extends { params?: Record<string, string> } = AuthContext>(
  handler: AuthenticatedHandler<TContext & AuthContext>
) => withRole<TContext>(["admin", "vet"])(handler)

export const requireAnyRole = <TContext extends { params?: Record<string, string> } = AuthContext>(
  handler: AuthenticatedHandler<TContext & AuthContext>
) => withRole<TContext>(["admin", "vet", "assistant"])(handler)

export const requireMedicalAccess = <TContext extends { params?: Record<string, string> } = AuthContext>(
  handler: AuthenticatedHandler<TContext & AuthContext>
) => withPermission<TContext>("manage_medical_records")(handler)

export const requireUserManagement = <TContext extends { params?: Record<string, string> } = AuthContext>(
  handler: AuthenticatedHandler<TContext & AuthContext>
) => withPermission<TContext>("manage_users")(handler)

export const requireDeletePermission = <TContext extends { params?: Record<string, string> } = AuthContext>(
  handler: AuthenticatedHandler<TContext & AuthContext>
) => withAnyPermission<TContext>(["delete_medical_records", "delete_pets", "delete_owners"])(handler)

export const requireInvoiceAccess = <TContext extends { params?: Record<string, string> } = AuthContext>(
  handler: AuthenticatedHandler<TContext & AuthContext>
) => withPermission<TContext>("manage_invoices")(handler)

export const requireAppointmentAccess = <TContext extends { params?: Record<string, string> } = AuthContext>(
  handler: AuthenticatedHandler<TContext & AuthContext>
) => withPermission<TContext>("manage_appointments")(handler)

export const requirePetAccess = <TContext extends { params?: Record<string, string> } = AuthContext>(
  handler: AuthenticatedHandler<TContext & AuthContext>
) => withPermission<TContext>("manage_pets")(handler)

export const requireOwnerAccess = <TContext extends { params?: Record<string, string> } = AuthContext>(
  handler: AuthenticatedHandler<TContext & AuthContext>
) => withPermission<TContext>("manage_owners")(handler)

export const requireReportAccess = <TContext extends { params?: Record<string, string> } = AuthContext>(
  handler: AuthenticatedHandler<TContext & AuthContext>
) => withPermission<TContext>("view_reports")(handler)

export const requireAdminPanel = <TContext extends { params?: Record<string, string> } = AuthContext>(
  handler: AuthenticatedHandler<TContext & AuthContext>
) => withPermission<TContext>("access_admin_panel")(handler)