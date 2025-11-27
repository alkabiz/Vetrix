import { type NextRequest, NextResponse } from "next/server"
import { AppointmentService } from "./service"
import { validateAppointment } from "./validator"
import { handleApiError, logRequest } from "@/lib/core/error-handler"

export class AppointmentController {
    static async getAll(request: NextRequest) {
        try {
            logRequest(request, "/api/appointments")
            const appointments = AppointmentService.getAll()
            return NextResponse.json(appointments)
        } catch (error) {
            return handleApiError(error)
        }
    }

    static async create(request: NextRequest) {
        try {
            logRequest(request, "/api/appointments")
            const data = await validateAppointment(request)
            const newAppointment = AppointmentService.create(data)
            return NextResponse.json(newAppointment, { status: 201 })
        } catch (error) {
            return handleApiError(error)
        }
    }
}
