import { UserRole } from './types';

// Función genérica para crear verificadores de permisos
const createPermissionChecker = (allowedRoles: UserRole[]) => 
  (role: UserRole): boolean => allowedRoles.includes(role);

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
  canViewMedicalRecords: (role: UserRole, isOwner: boolean = false): boolean => {
    return permissions.canManageMedicalRecords(role) || (role === 'assistant' && isOwner);
  },
  
  canEditInvoices: createPermissionChecker(['admin', 'vet']),
  canViewReports: createPermissionChecker(['admin', 'vet']),
} as const;

// Verificador de permisos por recurso
export const checkResourcePermission = (
  userRole: UserRole, 
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