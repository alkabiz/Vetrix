import { NextResponse } from "next/server"
import { SpeciesService } from "./service"

export async function GET() {
    try {
        const species = SpeciesService.getAll()
        return NextResponse.json(species)
    } catch (error) {
        console.error("Error fetching species:", error)
        return NextResponse.json(
            { error: "Failed to fetch species" },
            { status: 500 }
        )
    }
}
