import { NextResponse } from "next/server"
import { SterilizationTypeService } from "./service"

export async function GET() {
    try {
        const sterilizationTypes = SterilizationTypeService.getAll()
        return NextResponse.json(sterilizationTypes)
    } catch (error) {
        console.error("Error fetching sterilization types:", error)
        return NextResponse.json(
            { error: "Failed to fetch sterilization types" },
            { status: 500 }
        )
    }
}
