import type { User } from "@/lib/database/database"

export function hasPermission(user: User | null, permission: string): boolean {
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

export function canManagePets(user: User | null): {
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