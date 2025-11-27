import { type NextRequest, NextResponse } from "next/server"
import { MedicalRecordService } from "./service"
import { validateMedicalRecord } from "./validator"
import { handleApiError, logRequest } from "@/lib/core/error-handler"

export class MedicalRecordController {
    static async getAll(request: NextRequest) {
        try {
            logRequest(request, "/api/medical-records")
            const { searchParams } = new URL(request.url)
            const petId = searchParams.get("pet_id") || undefined

            const records = MedicalRecordService.getAll(petId)
            return NextResponse.json(records)
        } catch (error) {
            return handleApiError(error)
        }
    }

    static async create(request: NextRequest) {
        try {
            logRequest(request, "/api/medical-records")
            const data = await validateMedicalRecord(request)
            const newRecord = MedicalRecordService.create(data)
            return NextResponse.json(newRecord, { status: 201 })
        } catch (error) {
            return handleApiError(error)
        }
    }
}
