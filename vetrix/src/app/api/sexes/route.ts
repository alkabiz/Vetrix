import { NextResponse } from "next/server"
import { SexService } from "./service"

export async function GET() {
    try {
        const sexes = SexService.getAll()
        return NextResponse.json(sexes)
    } catch (error) {
        console.error("Error fetching sexes:", error)
        return NextResponse.json(
            { error: "Failed to fetch sexes" },
            { status: 500 }
        )
    }
}
