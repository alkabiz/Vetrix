import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers, verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Se requiere token de autorización" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Token no válido o caducado" }, { status: 401 })
    }

    // Only admin can view all users
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Acceso denegado. Se requiere rol de administrador." }, { status: 403 })
    }

    const users = await getAllUsers()
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
