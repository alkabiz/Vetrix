import { type NextRequest, NextResponse } from "next/server";
import { verifyToken, User } from "./auth";
import { UserRole } from "../lib/types";
import { permissions } from "./permissions";

// Tipo para el contexto de autenticación
export interface AuthContext {
  user: User;
}

// Tipo para handlers autenticados
export type AuthenticatedHandler = (
  request: NextRequest, 
  context: AuthContext
) => Promise<NextResponse>;

// Manejo centralizado de errores
const createErrorResponse = (message: string, status: number) => {
  console.error(`Auth Error (${status}):`, message);
  return NextResponse.json({ error: message }, { status });
};

// Middleware de autenticación mejorado
export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const authHeader = request.headers.get("authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return createErrorResponse("Se requiere token de autorización", 401);
      }

      const token = authHeader.substring(7);
      
      if (!token.trim()) {
        return createErrorResponse("Token de autorización no válido", 401);
      }

      const user = verifyToken(token);

      if (!user) {
        return createErrorResponse("Token no válido o caducado", 401);
      }

      // Crear contexto de autenticación
      const authContext: AuthContext = { user };

      return handler(request, authContext);
    } catch (error) {
      console.error("Error de middleware de autenticación:", error);
      return createErrorResponse("Error en la autenticación", 401);
    }
  };
}

// Middleware de autorización por roles
export function withRole(allowedRoles: UserRole[]) {
  return (handler: AuthenticatedHandler) =>
    withAuth(async (request: NextRequest, context: AuthContext) => {
      const { user } = context;

      if (!allowedRoles.includes(user.role)) {
        return createErrorResponse(
          `Acceso denegado. Funciones requeridas: ${allowedRoles.join(", ")}`, 
          403
        );
      }

      return handler(request, context);
    });
}

// Middleware de autorización por permisos específicos
export function withPermission(permissionCheck: (role: UserRole) => boolean) {
  return (handler: AuthenticatedHandler) =>
    withAuth(async (request: NextRequest, context: AuthContext) => {
      const { user } = context;

      if (!permissionCheck(user.role)) {
        return createErrorResponse("Permisos insuficientes", 403);
      }

      return handler(request, context);
    });
}

// Shortcuts de middleware más legibles
export const requireAdmin = withRole(["admin"]);
export const requireVetOrAdmin = withRole(["admin", "vet"]);
export const requireAnyRole = withRole(["admin", "vet", "assistant"]);

// Middlewares específicos por funcionalidad
export const requireMedicalAccess = withPermission(permissions.canManageMedicalRecords);
export const requireUserManagement = withPermission(permissions.canManageUsers);
export const requireDeletePermission = withPermission(permissions.canDelete);