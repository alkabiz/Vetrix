import {
    findUserByEmail,
    findUserByUsername,
    updateUserLoginInfo,
    incrementFailedLoginAttempts,
    isUserLocked,
    logUserActivity,
    getUserPermissions
} from "@/lib/database/database-auth"
import { createUser } from "@/lib/auth/auth"
import { generateToken, verifyPassword } from "@/src/lib/auth-server"
import { type LoginInput, type RegisterInput } from "./validator"
import { AuthenticationError, ValidationError } from "@/lib/core/error-handler"

// Simple in-memory rate limiting (replace with Redis in production)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

export class AuthService {
    private static checkRateLimit(identifier: string): boolean {
        const now = Date.now()
        const attempts = loginAttempts.get(identifier)

        if (!attempts) {
            loginAttempts.set(identifier, { count: 1, lastAttempt: now })
            return true
        }

        if (now - attempts.lastAttempt > LOCKOUT_TIME) {
            loginAttempts.set(identifier, { count: 1, lastAttempt: now })
            return true
        }

        if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
            return false
        }

        attempts.count++
        attempts.lastAttempt = now
        return true
    }

    static async login(data: LoginInput, clientIP: string, userAgent: string) {
        const identifier = `${clientIP}-${data.login}`

        if (await isUserLocked(data.login)) {
            throw new AuthenticationError("Account temporarily locked. Please try again later.")
        }

        if (!this.checkRateLimit(identifier)) {
            throw new AuthenticationError("Too many login attempts. Please try again later.")
        }

        let user = await findUserByEmail(data.login)
        if (!user) {
            user = await findUserByUsername(data.login)
        }

        if (!user) {
            await incrementFailedLoginAttempts(data.login)
            throw new AuthenticationError("Invalid credentials")
        }

        const isValidPassword = await verifyPassword(data.password, user.password_hash)
        if (!isValidPassword) {
            await incrementFailedLoginAttempts(data.login)
            await logUserActivity(user.id, "failed_login", "authentication", undefined, clientIP, userAgent, "medium")
            throw new AuthenticationError("Invalid credentials")
        }

        const permissions = await getUserPermissions(user.id)
        const { password_hash, ...userWithoutPassword } = user
        const token = generateToken(userWithoutPassword)

        await updateUserLoginInfo(user.id, clientIP)
        await logUserActivity(user.id, "successful_login", "authentication", undefined, clientIP, userAgent, "low")
        loginAttempts.delete(identifier)

        return {
            message: "Login successful",
            token,
            user: userWithoutPassword,
            permissions,
        }
    }

    static async register(data: RegisterInput) {
        const existingUserByEmail = await findUserByEmail(data.email)
        if (existingUserByEmail) {
            throw new ValidationError("User with this email already exists")
        }

        const existingUserByUsername = await findUserByUsername(data.username)
        if (existingUserByUsername) {
            throw new ValidationError("User with this username already exists")
        }

        const newUser = await createUser(data)
        return {
            message: "User created successfully",
            user: newUser,
        }
    }
}
