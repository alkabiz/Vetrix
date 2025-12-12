import { DatabaseUser } from "@/lib/database/database-auth"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

/**
 * Compares a plain text password with a hashed password.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

export function generateToken(user: Omit<DatabaseUser, "password_hash">): string {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables")
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username,
  }

  // Generate token that expires in 1 hour
  return jwt.sign(payload, jwtSecret, { expiresIn: "1h" })
}

export function verifyToken(token: string): any {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables")
  }
  
  try {
      return jwt.verify(token, jwtSecret)
  } catch (error) {
      return null
  }
}