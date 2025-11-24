import { getDatabase } from "./database/database"
import type { User } from "../core/types"
import bcrypt from "bcryptjs"

export interface DatabaseUser extends User {
  role: "admin" | "vet" | "assistant"
}

export interface DatabaseAuthUser extends DatabaseUser {
  password_hash: string
}

export async function findUserByEmail(email: string): Promise<DatabaseAuthUser | null> {
  try {
    const db = getDatabase()
    const stmt = db.prepare(`
      SELECT 
        u.id, u.username, u.email, u.passwordHash as password_hash,
        r.name as role, u.createdAt as created_at
      FROM usr_users u
      JOIN cat_roles r ON u.roleId = r.id
      WHERE u.email = ? AND u.statusId = 1 AND r.isActive = 1
    `)

    const user = stmt.get(email.toLowerCase()) as DatabaseAuthUser | undefined
    return user || null
  } catch (error) {
    console.error("Error finding user by email:", error)
    throw new Error("Database error while finding user")
  }
}

export async function findUserByUsername(username: string): Promise<DatabaseAuthUser | null> {
  try {
    const db = getDatabase()
    const stmt = db.prepare(`
      SELECT 
        u.id, u.username, u.email, u.passwordHash as password_hash,
        r.name as role, u.createdAt as created_at
      FROM usr_users u
      JOIN cat_roles r ON u.roleId = r.id
      WHERE u.username = ? AND u.statusId = 1 AND r.isActive = 1
    `)

    const user = stmt.get(username.toLowerCase()) as DatabaseAuthUser | undefined
    return user || null
  } catch (error) {
    console.error("Error finding user by username:", error)
    throw new Error("Database error while finding user")
  }
}

export async function findUserById(id: number): Promise<DatabaseUser | null> {
  try {
    const db = getDatabase()
    const stmt = db.prepare(`
      SELECT 
        u.id, u.username, u.email,
        r.name as role, u.createdAt as created_at
      FROM usr_users u
      JOIN cat_roles r ON u.roleId = r.id
      WHERE u.id = ? AND u.statusId = 1 AND r.isActive = 1
    `)

    const user = stmt.get(id) as DatabaseUser | undefined
    return user || null
  } catch (error) {
    console.error("Error finding user by ID:", error)
    throw new Error("Database error while finding user")
  }
}

export async function getUserPermissions(userId: number): Promise<string[]> {
  try {
    const db = getDatabase()
    const stmt = db.prepare(`
      SELECT DISTINCT p.name
      FROM usr_users u
      JOIN cat_roles r ON u.roleId = r.id
      JOIN cat_role_permissions rp ON r.id = rp.roleId
      JOIN cat_permissions p ON rp.permissionId = p.id
      WHERE u.id = ? AND u.statusId = 1 AND r.isActive = 1 AND p.isActive = 1
    `)

    const permissions = stmt.all(userId) as { name: string }[]
    return permissions.map((p) => p.name)
  } catch (error) {
    console.error("Error getting user permissions:", error)
    return []
  }
}

export async function updateUserLoginInfo(userId: number, ipAddress?: string): Promise<void> {
  try {
    const db = getDatabase()
    const stmt = db.prepare(`
      UPDATE usr_users 
      SET lastLogin = CURRENT_TIMESTAMP, 
          lastLoginIp = ?,
          failedLoginAttempts = 0
      WHERE id = ?
    `)

    stmt.run(ipAddress || null, userId)
  } catch (error) {
    console.error("Error updating user login info:", error)
  }
}

export async function incrementFailedLoginAttempts(identifier: string): Promise<void> {
  try {
    const db = getDatabase()
    const stmt = db.prepare(`
      UPDATE usr_users 
      SET failedLoginAttempts = failedLoginAttempts + 1,
          lockedUntil = CASE 
            WHEN failedLoginAttempts >= 4 THEN datetime('now', '+15 minutes')
            ELSE lockedUntil
          END
      WHERE (email = ? OR username = ?) AND statusId = 1
    `)

    stmt.run(identifier, identifier)
  } catch (error) {
    console.error("Error incrementing failed login attempts:", error)
  }
}

export async function isUserLocked(identifier: string): Promise<boolean> {
  try {
    const db = getDatabase()
    const stmt = db.prepare(`
      SELECT lockedUntil
      FROM usr_users 
      WHERE (email = ? OR username = ?) AND statusId = 1
    `)

    const result = stmt.get(identifier, identifier) as { lockedUntil: string | null } | undefined

    if (!result?.lockedUntil) return false

    const lockTime = new Date(result.lockedUntil)
    const now = new Date()

    return lockTime > now
  } catch (error) {
    console.error("Error checking if user is locked:", error)
    return false
  }
}

export async function logUserActivity(
  userId: number,
  action: string,
  resourceType: string,
  resourceId?: number,
  ipAddress?: string,
  userAgent?: string,
  severity: "low" | "medium" | "high" | "critical" = "low",
): Promise<void> {
  try {
    const db = getDatabase()
    const stmt = db.prepare(`
      INSERT INTO usr_user_activity_log 
      (userId, action, resourceType, resourceId, ipAddress, userAgent, severity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(userId, action, resourceType, resourceId || null, ipAddress || null, userAgent || null, severity)
  } catch (error) {
    console.error("Error logging user activity:", error)
  }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}
