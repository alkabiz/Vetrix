import { type NextRequest, NextResponse } from "next/server"
import { createUser, findUserByEmail, findUserByUsername } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, role } = await request.json()

    // Validate required fields
    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: "Username, email, password, and role are required" }, { status: 400 })
    }

    // Validate role
    if (!["admin", "vet", "assistant"].includes(role)) {
      return NextResponse.json({ error: "Invalid role. Must be admin, vet, or assistant" }, { status: 400 })
    }

    // Check if user already exists
    const existingUserByEmail = await findUserByEmail(email)
    if (existingUserByEmail) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    const existingUserByUsername = await findUserByUsername(username)
    if (existingUserByUsername) {
      return NextResponse.json({ error: "User with this username already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = await createUser({ username, email, password, role })

    return NextResponse.json(
      {
        message: "User created successfully",
        user: newUser,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
