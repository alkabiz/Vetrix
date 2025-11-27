import { type NextRequest, NextResponse } from "next/server"
import { PetService } from "./service"
import { validatePet } from "./validator"
import { handleApiError, logRequest } from "@/lib/core/error-handler"

export class PetController {
    static async getAll(request: NextRequest) {
        try {
            logRequest(request, "/api/pets")
            const pets = PetService.getAll()
            return NextResponse.json(pets)
        } catch (error) {
            return handleApiError(error)
        }
    }

    static async create(request: NextRequest) {
        try {
            logRequest(request, "/api/pets")
            const data = await validatePet(request)
            const newPet = PetService.create(data)
            return NextResponse.json(newPet, { status: 201 })
        } catch (error) {
            return handleApiError(error)
        }
    }
}
