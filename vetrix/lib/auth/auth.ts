import type { RoleName, User } from "../database/database"

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

  if (userData.role && !validRoles.includes(userData.role as RoleName)) {
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

export function hasPermission(userRole: RoleName, requiredPermission: string): boolean {
  const rolePermissions: Record<RoleName, string[]> = {
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
  return await getAllUsers()
}

export async function findUserById(id: number): Promise<User | null> {
  const users = await getAllUsers()
  return users.find((user) => user.id === id) || null
}

export async function createUser(userData: {
  username: string
  email: string
  password: string
  role: RoleName
}): Promise<User> {
  const { hashPassword } = await import("./password-service")
  const passwordHash = await hashPassword(userData.password)

  // Map role name to roleId (this is a simplified mock mapping)
  const roleIdMap: Record<RoleName, number> = {
    admin: 1,
    vet: 2,
    assistant: 3,
  }

  // In a real app, this would save to database
  const now = new Date().toISOString()
  const newUser: User = {
    id: Date.now(), // Simple ID generation for mock
    username: userData.username,
    email: userData.email,
    passwordHash: passwordHash,
    roleId: roleIdMap[userData.role],
    statusId: 1, // Default to active status
    veterinarianId: null,
    lastLogin: null,
    lastLoginIp: null,
    currentSessionId: null,
    failedLoginAttempts: 0,
    lockedUntil: null,
    passwordChangedAt: now,
    passwordExpiresAt: null,
    mustChangePassword: false,
    passwordHistory: null,
    twoFactorEnabled: false,
    twoFactorSecret: null,
    backupCodes: null,
    twoFactorVerifiedAt: null,
    sessionTimeoutMinutes: 30,
    timezone: "America/Bogota",
    preferredLanguage: "es",
    emailNotifications: true,
    smsNotifications: false,
    notificationPreferences: null,
    isEmailVerified: false,
    emailVerificationToken: null,
    emailVerifiedAt: null,
    apiAccessEnabled: false,
    apiKeyHash: null,
    apiLastUsed: null,
    createdAt: now,
    updatedAt: now,
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

export { generateAccessToken as generateToken, verifyAccessToken as verifyToken } from "./token-service"