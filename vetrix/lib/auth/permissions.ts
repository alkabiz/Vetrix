import { RoleName } from '../database/database';

// Función genérica para crear verificadores de permisos
const createPermissionChecker = (allowedRoles: RoleName[]) =>
  (role: RoleName): boolean => allowedRoles.includes(role);

// Sistema de permisos más limpio y mantenible
export const permissions = {
  // Permisos administrativos
  canManageUsers: createPermissionChecker(['admin']),
  canManageAllData: createPermissionChecker(['admin']),
  canAccessAdminPanel: createPermissionChecker(['admin']),

  // Permisos de veterinario
  canManageMedicalRecords: createPermissionChecker(['admin', 'vet']),
  canViewAllRecords: createPermissionChecker(['admin', 'vet']),
  canPrescribeMedication: createPermissionChecker(['admin', 'vet']),
  canPerformSurgery: createPermissionChecker(['admin', 'vet']),

  // Permisos de asistente
  canManageBasicData: createPermissionChecker(['admin', 'vet', 'assistant']),
  canCreateAppointments: createPermissionChecker(['admin', 'vet', 'assistant']),
  canViewBasicInfo: createPermissionChecker(['admin', 'vet', 'assistant']),
  canUpdatePetInfo: createPermissionChecker(['admin', 'vet', 'assistant']),

  // Permisos generales
  canRead: createPermissionChecker(['admin', 'vet', 'assistant']),
  canWrite: createPermissionChecker(['admin', 'vet', 'assistant']),
  canDelete: createPermissionChecker(['admin', 'vet']),

  // Permisos específicos por recurso
  canViewMedicalRecords: (role: RoleName, isOwner: boolean = false): boolean => {
    return permissions.canManageMedicalRecords(role) || (role === 'assistant' && isOwner);
  },

  canEditInvoices: createPermissionChecker(['admin', 'vet']),
  canViewReports: createPermissionChecker(['admin', 'vet']),
} as const;

// Verificador de permisos por recurso
export const checkResourcePermission = (
  userRole: RoleName,
  action: keyof typeof permissions,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalContext?: any
): boolean => {
  const permissionCheck = permissions[action];
  if (typeof permissionCheck === 'function') {
    return permissionCheck(userRole, additionalContext);
  }
  return false;
};

// Check permissions by string name (compatible with auth-middleware and auth-context logic)
export const hasPermission = (role: string, permission: string): boolean => {
    // Role mapping if needed, but we assume role is RoleName string ('admin' | 'vet' | 'assistant')
    // If role is not a valid RoleName, default to no permissions or minimal
    const validRoles: RoleName[] = ['admin', 'vet', 'assistant'];
    if (!validRoles.includes(role as RoleName)) return false;
    const roleName = role as RoleName;

    switch (permission) {
      case "manage_users":
        return permissions.canManageUsers(roleName);
      case "manage_medical_records":
        return permissions.canManageMedicalRecords(roleName);
      case "delete_records":
         // Mapping "delete_records" to canDelete or explicit check
         // In auth-context: [1, 2] (admin, vet)
        return permissions.canDelete(roleName); 
      case "view_all":
         // In auth-context: [1, 2, 3]. permissions.canViewAllRecords is [1,2]. 
         // But permissions.canViewBasicInfo is [1,2,3].
         // However, "view_all" usually implies everything safe to view.
         // Let's explicitly define it to match auth-context [1, 2, 3] logic
         return ['admin', 'vet', 'assistant'].includes(roleName);
      case "create_basic":
         // In auth-context: [1, 2, 3]
         return ['admin', 'vet', 'assistant'].includes(roleName);
      default:
        return false;
    }
}