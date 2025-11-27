import { type NextRequest, NextResponse } from "next/server"
import { OwnerService } from "./service"
import { validateOwner } from "./validator"
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
}
