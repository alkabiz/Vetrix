import pool from "@/lib/db"
import { RowDataPacket } from "mysql2"

export interface DatabaseUser extends RowDataPacket {
  id: number
  email: string
  username: string
  password_hash: string
  role: string // mapped from cat_roles.name
  role_id: number
  status_id: number
  failed_login_attempts: number
  locked_until: Date | null
  created_at: Date
}

export async function findUserByEmail(email: string): Promise<DatabaseUser | null> {
  const [rows] = await pool.query<DatabaseUser[]>(`
    SELECT u.*, r.name as role 
    FROM usr_users u 
    LEFT JOIN cat_roles r ON u.role_id = r.id 
    WHERE u.email = ?
  `, [email])
  return rows[0] || null
}

export async function findUserByUsername(username: string): Promise<DatabaseUser | null> {
  const [rows] = await pool.query<DatabaseUser[]>(`
    SELECT u.*, r.name as role 
    FROM usr_users u 
    LEFT JOIN cat_roles r ON u.role_id = r.id 
    WHERE u.username = ?
  `, [username])
  return rows[0] || null
}

export async function updateUserLoginInfo(userId: number, ip: string): Promise<void> {
  await pool.query(`
    UPDATE usr_users 
    SET last_login = NOW(), 
        last_login_ip = ?,
        failed_login_attempts = 0,
        locked_until = NULL
    WHERE id = ?
  `, [ip, userId])
}

export async function incrementFailedLoginAttempts(login: string): Promise<void> {
  // Try to find user by email or username first to get ID, or just update directly
  // Note: current schema has is_email_verified etc.
  // We'll update by username OR email
  await pool.query(`
    UPDATE usr_users 
    SET failed_login_attempts = failed_login_attempts + 1
    WHERE email = ? OR username = ?
  `, [login, login])
}

export async function isUserLocked(login: string): Promise<boolean> {
  const [rows] = await pool.query<DatabaseUser[]>(`
    SELECT locked_until 
    FROM usr_users 
    WHERE email = ? OR username = ?
  `, [login, login])
  
  const user = rows[0]
  if (!user || !user.locked_until) return false
  
  return new Date(user.locked_until) > new Date()
}

export async function logUserActivity(
  userId: number,
  action: string,
  resourceType: string,
  resourceId: number | undefined,
  ip: string,
  userAgent: string,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
): Promise<void> {
  await pool.query(`
    INSERT INTO usr_user_activity_log 
    (user_id, action, resource_type, resource_id, ip_address, user_agent, severity)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [userId, action, resourceType, resourceId || null, ip, userAgent, severity])
}

export async function getUserPermissions(userId: number): Promise<string[]> {
  const [rows] = await pool.query<(RowDataPacket & { name: string })[]>(`
    SELECT p.name 
    FROM cat_permissions p
    JOIN usr_role_permissions rp ON p.id = rp.permission_id
    JOIN usr_users u ON u.role_id = rp.role_id
    WHERE u.id = ?
  `, [userId])
  
  return rows.map(r => r.name)
}
