import { NextRequest, NextResponse } from "next/server"
import { BreedService } from "./service"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const speciesId = searchParams.get("speciesId")

        const breeds = BreedService.getAll(
            speciesId ? parseInt(speciesId) : undefined
        )

        return NextResponse.json(breeds)
    } catch (error) {
        console.error("Error fetching breeds:", error)
        return NextResponse.json(
            { error: "Failed to fetch breeds" },
            { status: 500 }
        )
    }
}
