import { type NextRequest, NextResponse } from "next/server"
import { OwnerService } from "./service"
import { validateOwner, validateOwnerUpdate } from "./validator"
import { handleApiError, logRequest } from "@/lib/core/error-handler"

export class OwnerController {
    static async getAll(request: NextRequest) {
        try {
            logRequest(request, "/api/owners")
            const owners = OwnerService.getAll()
            return NextResponse.json(owners)
        } catch (error) {
            return handleApiError(error)
        }
    }

    static async getById(request: NextRequest, { params }: { params: { id: string } }) {
        try {
            logRequest(request, `/api/owners/${params.id}`)
            const owner = OwnerService.getById(params.id)
            return NextResponse.json(owner)
        } catch (error) {
            return handleApiError(error)
        }
    }

    static async create(request: NextRequest) {
        try {
            logRequest(request, "/api/owners")
            const data = await validateOwner(request)
            const newOwner = OwnerService.create(data)
            return NextResponse.json(newOwner, { status: 201 })
        } catch (error) {
            return handleApiError(error)
        }
    }

    static async update(request: NextRequest, { params }: { params: { id: string } }) {
        try {
            logRequest(request, `/api/owners/${params.id}`)
            const data = await validateOwnerUpdate(request)
            const updatedOwner = OwnerService.update(params.id, data)
            return NextResponse.json(updatedOwner)
        } catch (error) {
            return handleApiError(error)
        }
    }

    static async delete(request: NextRequest, { params }: { params: { id: string } }) {
        try {
            logRequest(request, `/api/owners/${params.id}`)
            OwnerService.delete(params.id)
            return NextResponse.json({ message: "Owner deleted successfully" })
        } catch (error) {
            return handleApiError(error)
        }
    }
}
