import type { UserRole, User } from "./data"
import { getMockUsers } from "./mockData"

export const validatePasswordPolicy = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 12) {
    errors.push("Password must be at least 12 characters long")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  // Check for common patterns
  if (/(.)\\1{2,}/.test(password)) {
    errors.push("Password cannot contain repeated characters")
  }

  if (/123|abc|qwe|password|admin/i.test(password)) {
    errors.push("Password cannot contain common patterns")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Validación de entrada actualizada
export const validateUserData = (userData: {
  username?: string
  email?: string
  password?: string
  role?: string
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  const validRoles = ["admin", "vet", "assistant"]

  if (userData.username && userData.username.length < 5) {
    errors.push("El nombre de usuario debe tener al menos 5 caracteres.")
  }

  if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.push("Formato de correo electrónico no válido")
  }

  if (userData.password) {
    const passwordValidation = validatePasswordPolicy(userData.password)
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors)
    }
  }

  if (userData.role && !validRoles.includes(userData.role as UserRole)) {
    errors.push(`Rol no válido. Debe ser uno de los siguientes: ${validRoles.join(", ")}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function extractTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  return authHeader.substring(7) // Remove 'Bearer ' prefix
}

export function hasPermission(userRole: UserRole, requiredPermission: string): boolean {
  const rolePermissions: Record<UserRole, string[]> = {
    admin: [
      "manage_users",
      "manage_medical_records",
      "manage_appointments",
      "manage_pets",
      "manage_owners",
      "manage_invoices",
      "access_admin_panel",
      "manage_system_settings",
      "view_reports",
      "manage_reports",
    ],
    vet: [
      "manage_medical_records",
      "manage_appointments",
      "manage_pets",
      "manage_owners",
      "manage_invoices",
      "view_reports",
    ],
    assistant: [
      "view_medical_records",
      "manage_appointments",
      "manage_pets",
      "manage_owners",
      "create_invoices",
      "view_invoices",
    ],
  }

  return rolePermissions[userRole]?.includes(requiredPermission) || false
}

export async function getAllUsers(): Promise<User[]> {
  return getMockUsers()
}

export async function findUserById(id: number): Promise<User | null> {
  const users = await getAllUsers()
  return users.find((user) => user.id === id) || null
}

export async function createUser(userData: {
  username: string
  email: string
  password: string
  role: UserRole
}): Promise<User> {
  const { hashPassword } = await import("./auth-server")
  const passwordHash = await hashPassword(userData.password)

  // In a real app, this would save to database
  const newUser: User = {
    id: Date.now(), // Simple ID generation for mock
    username: userData.username,
    email: userData.email,
    password_hash: passwordHash,
    role: userData.role,
    created_at: new Date().toISOString(),
  }

  return newUser
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await getAllUsers()
  return users.find((user) => user.email === email) || null
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const users = await getAllUsers()
  return users.find((user) => user.username === username) || null
}

export { generateToken, verifyToken } from "./auth-server"