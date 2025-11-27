import { type NextRequest, NextResponse } from "next/server"
import { PetService } from "./service"
import { validatePet, validatePetUpdate } from "./validator"
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

    static async getById(request: NextRequest, { params }: { params: { id: string } }) {
        try {
            logRequest(request, `/api/pets/${params.id}`)
            const pet = PetService.getById(params.id)
            return NextResponse.json(pet)
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

    static async update(request: NextRequest, { params }: { params: { id: string } }) {
        try {
            logRequest(request, `/api/pets/${params.id}`)
            const data = await validatePetUpdate(request)
            const updatedPet = PetService.update(params.id, data)
            return NextResponse.json(updatedPet)
        } catch (error) {
            return handleApiError(error)
        }
    }

    static async delete(request: NextRequest, { params }: { params: { id: string } }) {
        try {
            logRequest(request, `/api/pets/${params.id}`)
            PetService.delete(params.id)
            return NextResponse.json({ message: "Pet deleted successfully" })
        } catch (error) {
            return handleApiError(error)
        }
    }
}
