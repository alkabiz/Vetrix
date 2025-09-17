import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { User, AuthUser, UserRole } from "./types"
import { authConfig, VALID_ROLES } from "./config"
import { getMockUsers } from "./mockData"

// Cache para usuarios mock (en producción usar base de datos)
let mockUsersCache: AuthUser[] | null = null

const getMockUsersCache = async (): Promise<AuthUser[]> => {
  if (!mockUsersCache) {
    mockUsersCache = await getMockUsers()
  }
  return mockUsersCache
}

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
  if (/(.)\1{2,}/.test(password)) {
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

  if (userData.role && !VALID_ROLES.includes(userData.role as UserRole)) {
    errors.push(`Rol no válido. Debe ser uno de los siguientes: ${VALID_ROLES.join(", ")}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, authConfig.BCRYPT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: User): string {
  // Validar que el usuario tenga un role válido
  if (!VALID_ROLES.includes(user.role)) {
    throw new Error("Rol de usuario no válido")
  }

  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    authConfig.JWT_SECRET,
    { expiresIn: authConfig.JWT_EXPIRATION },
  )
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, authConfig.JWT_SECRET) as User

    // Validar que el role sea válido
    if (!VALID_ROLES.includes(decoded.role)) {
      return null
    }

    return decoded
  } catch (error) {
    return null
  }
}

// Servicios de usuario con mejor manejo de errores
export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  try {
    const users = await getMockUsersCache()
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null
  } catch (error) {
    console.error("Error al buscar al usuario por correo electrónico:", error)
    throw new Error("Error en la base de datos al buscar un usuario")
  }
}

export async function findUserByUsername(username: string): Promise<AuthUser | null> {
  try {
    const users = await getMockUsersCache()
    return users.find((user) => user.username.toLowerCase() === username.toLowerCase()) || null
  } catch (error) {
    console.error("Error al buscar al usuario por su nombre de usuario:", error)
    throw new Error("Error en la base de datos al buscar un usuario")
  }
}

export async function findUserById(id: number): Promise<User | null> {
  try {
    const users = await getMockUsersCache()
    const user = users.find((user) => user.id === id)
    if (!user) return null

    // Remover password_hash del usuario retornado
    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("Error al buscar al usuario por su ID:", error)
    throw new Error("Error en la base de datos al buscar un usuario")
  }
}

export async function createUser(userData: {
  username: string
  email: string
  password: string
  role: UserRole
}): Promise<User> {
  // Validar datos de entrada
  const validation = validateUserData(userData)
  if (!validation.isValid) {
    throw new Error(`La validación falló: ${validation.errors.join(", ")}`)
  }

  try {
    const users = await getMockUsersCache()

    // Verificar que no exista usuario con el mismo email o username
    if (users.some((user) => user.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error("El usuario con este correo electrónico ya existe.")
    }

    if (users.some((user) => user.username.toLowerCase() === userData.username.toLowerCase())) {
      throw new Error("El usuario con este nombre de usuario ya existe.")
    }

    const passwordHash = await hashPassword(userData.password)
    const newUser: AuthUser = {
      id: Math.max(...users.map((u) => u.id), 0) + 1, // Mejor generación de ID
      username: userData.username,
      email: userData.email,
      password_hash: passwordHash,
      role: userData.role,
      created_at: new Date().toISOString(),
    }

    users.push(newUser)

    // Retornar usuario sin password
    const { password_hash, ...userWithoutPassword } = newUser
    return userWithoutPassword
  } catch (error) {
    console.error("Error al crear usuario:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Error en la base de datos al crear un usuario")
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const users = await getMockUsersCache()
    return users.map(({ password_hash, ...user }) => user)
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error)
    throw new Error("Error en la base de datos al recuperar usuarios")
  }
}

export { User, AuthUser, UserRole } from "./types"