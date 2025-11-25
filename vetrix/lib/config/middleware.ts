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
}

// Tipo para handlers autenticados
export type AuthenticatedHandler = (request: NextRequest, context: AuthContext) => Promise<NextResponse>

// Manejo centralizado de errores
const createErrorResponse = (message: string, status: number) => {
  console.error(`Auth Error (${status}):`, message)
  return NextResponse.json({ error: message }, { status })
}

export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
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

      // Crear contexto de autenticación
      const authContext: AuthContext = { user, permissions }

      return handler(request, authContext)
    } catch (error) {
      console.error("Error de middleware de autenticación:", error)
      return createErrorResponse("Error en la autenticación", 401)
    }
  }
}

// Middleware de autorización por roles
export function withRole(allowedRoles: RoleName[]) {
  return (handler: AuthenticatedHandler) =>
    withAuth(async (request: NextRequest, context: AuthContext) => {
      const { user } = context

      if (!allowedRoles.includes(user.role)) {
        return createErrorResponse(`Acceso denegado. Funciones requeridas: ${allowedRoles.join(", ")}`, 403)
      }

      return handler(request, context)
    })
}

export function withPermission(requiredPermission: string) {
  return (handler: AuthenticatedHandler) =>
    withAuth(async (request: NextRequest, context: AuthContext) => {
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

export function withAnyPermission(requiredPermissions: string[]) {
  return (handler: AuthenticatedHandler) =>
    withAuth(async (request: NextRequest, context: AuthContext) => {
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

// Shortcuts de middleware más legibles
export const requireAdmin = withRole(["admin"])
export const requireVetOrAdmin = withRole(["admin", "vet"])
export const requireAnyRole = withRole(["admin", "vet", "assistant"])

export const requireMedicalAccess = withPermission("manage_medical_records")
export const requireUserManagement = withPermission("manage_users")
export const requireDeletePermission = withAnyPermission(["delete_medical_records", "delete_pets", "delete_owners"])
export const requireInvoiceAccess = withPermission("manage_invoices")
export const requireAppointmentAccess = withPermission("manage_appointments")

export const requirePetAccess = withPermission("manage_pets")
export const requireOwnerAccess = withPermission("manage_owners")
export const requireReportAccess = withPermission("view_reports")
export const requireAdminPanel = withPermission("access_admin_panel")