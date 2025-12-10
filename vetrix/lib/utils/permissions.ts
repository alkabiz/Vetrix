// Simple interface for objects that have a role (matches both User and UserDTO)
interface UserWithRole {
  roleId: number
}

export function hasPermission(user: UserWithRole | null | undefined, permission: string): boolean {
  if (!user) return false
  
  // Simple role-based permission check
  const rolePermissions: Record<number, string[]> = {
    1: ['view_all', 'edit_all', 'delete_all', 'add_pets'], // admin
    2: ['view_all', 'edit_all', 'add_pets'], // vet
    3: ['view_all', 'edit_limited', 'add_pets'], // assistant
    4: ['view_own'] // client
  }
  
  return rolePermissions[user.roleId]?.includes(permission) || false
}

export function canManagePets(user: UserWithRole | null | undefined): {
  canView: boolean
  canAdd: boolean
  canEdit: boolean
  canDelete: boolean
} {
  return {
    canView: hasPermission(user, 'view_all') || hasPermission(user, 'view_own'),
    canAdd: hasPermission(user, 'add_pets'),
    canEdit: hasPermission(user, 'edit_all') || hasPermission(user, 'edit_limited'),
    canDelete: hasPermission(user, 'delete_all')
  }
}