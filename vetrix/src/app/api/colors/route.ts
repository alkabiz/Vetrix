import { NextResponse } from "next/server"
import { ColorService } from "./service"

export async function GET() {
    try {
        const colors = ColorService.getAll()
        return NextResponse.json(colors)
    } catch (error) {
        console.error("Error fetching colors:", error)
        return NextResponse.json(
            { error: "Failed to fetch colors" },
            { status: 500 }
        )
    }
}
