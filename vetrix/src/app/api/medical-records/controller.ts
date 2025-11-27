import { type NextRequest, NextResponse } from "next/server"
import { MedicalRecordService } from "./service"
import { validateMedicalRecord, validateMedicalRecordUpdate } from "./validator"
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

    static async getById(request: NextRequest, { params }: { params: { id: string } }) {
        try {
            logRequest(request, `/api/medical-records/${params.id}`)
            const record = MedicalRecordService.getById(params.id)
            return NextResponse.json(record)
        } catch (error) {
            return handleApiError(error)
        }
    }

    static async update(request: NextRequest, { params }: { params: { id: string } }) {
        try {
            logRequest(request, `/api/medical-records/${params.id}`)
            const data = await validateMedicalRecordUpdate(request)
            const updatedRecord = MedicalRecordService.update(params.id, data)
            return NextResponse.json(updatedRecord)
        } catch (error) {
            return handleApiError(error)
        }
    }

    static async delete(request: NextRequest, { params }: { params: { id: string } }) {
        try {
            logRequest(request, `/api/medical-records/${params.id}`)
            MedicalRecordService.delete(params.id)
            return NextResponse.json({ message: "Medical record deleted successfully" })
        } catch (error) {
            return handleApiError(error)
        }
    }
}
