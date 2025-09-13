import { type NextRequest, NextResponse } from "next/server"
import { createUser, findUserByEmail, findUserByUsername } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, role } = await request.json()

    // Validate required fields
    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: "Se requiere nombre de usuario, correo electrónico, contraseña y función." }, { status: 400 })
    }

    // Validate role
    if (!["admin", "vet", "assistant"].includes(role)) {
      return NextResponse.json({ error: "Rol no válido. Debe ser administrador, veterinario o asistente." }, { status: 400 })
    }

    // Check if user already exists
    const existingUserByEmail = await findUserByEmail(email)
    if (existingUserByEmail) {
      return NextResponse.json({ error: "El usuario con este correo electrónico ya existe." }, { status: 409 })
    }

    const existingUserByUsername = await findUserByUsername(username)
    if (existingUserByUsername) {
      return NextResponse.json({ error: "El usuario con este nombre de usuario ya existe." }, { status: 409 })
    }

    // Create new user
    const newUser = await createUser({ username, email, password, role })

    return NextResponse.json(
      {
        message: "Usuario creado correctamente",
        user: newUser,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error de registro:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
