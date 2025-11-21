import { type NextRequest, NextResponse } from "next/server"
import {
  findUserByEmail,
  findUserByUsername,
  updateUserLoginInfo,
  incrementFailedLoginAttempts,
  isUserLocked,
  logUserActivity,
  getUserPermissions,
} from "@/lib/database-auth"
import { generateToken, verifyPassword } from "@/lib/auth-server"

// Rate limiting simple (en producción usar Redis o similar)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutos

const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now()
  const attempts = loginAttempts.get(identifier)

  if (!attempts) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now })
    return true
  }

  // Resetear contador si ha pasado el tiempo de lockout
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { login, password } = body

    // Validación de entrada
    if (!login || !password) {
      return NextResponse.json({ error: "Se requiere nombre de usuario y contraseña." }, { status: 400 })
    }

    if (typeof login !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Formato de entrada no válido" }, { status: 400 })
    }

    const clientIP = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    const identifier = `${clientIP}-${login}`

    const isLocked = await isUserLocked(login.trim())
    if (isLocked) {
      return NextResponse.json(
        { error: "Cuenta bloqueada temporalmente. Inténtalo de nuevo más tarde." },
        { status: 423 },
      )
    }

    // Rate limiting
    if (!checkRateLimit(identifier)) {
      return NextResponse.json(
        { error: "Demasiados intentos de inicio de sesión. Inténtalo de nuevo más tarde." },
        { status: 429 },
      )
    }

    let user = await findUserByEmail(login.trim())
    if (!user) {
      user = await findUserByUsername(login.trim())
    }

    if (!user) {
      await incrementFailedLoginAttempts(login.trim())
      return NextResponse.json({ error: "Credenciales no válidas" }, { status: 401 })
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      await incrementFailedLoginAttempts(login.trim())
      await logUserActivity(user.id, "failed_login", "authentication", undefined, clientIP, userAgent, "medium")

      return NextResponse.json({ error: "Credenciales no válidas" }, { status: 401 })
    }

    const permissions = await getUserPermissions(user.id)

    // Generar token JWT
    const { password_hash, ...userWithoutPassword } = user
    const token = generateToken(userWithoutPassword)

    await updateUserLoginInfo(user.id, clientIP)
    await logUserActivity(user.id, "successful_login", "authentication", undefined, clientIP, userAgent, "low")

    // Limpiar intentos de login exitosos
    loginAttempts.delete(identifier)

    console.log(`Inicio de sesión correcto: ${user.username} (${user.role}) de ${clientIP}`)

    return NextResponse.json({
      message: "Inicio de sesión correcto",
      token,
      user: userWithoutPassword,
      permissions,
    })
  } catch (error) {
    console.error("Error de inicio de sesión:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}