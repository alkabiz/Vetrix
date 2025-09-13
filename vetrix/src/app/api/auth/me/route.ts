import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, findUserById } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Se requiere token de autorización" }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Token no válido o caducado" }, { status: 401 })
    }

    // Get fresh user data
    const user = await findUserById(decoded.id)
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error de verificación de autenticación:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
