import { type NextRequest, NextResponse } from "next/server"
import { AppointmentService } from "./service"
import { validateIdParam, validateRequest } from "@/lib/utils/validation/validators"
import { appointmentSchema } from "@/lib/utils/validation/schemas/appointment-schema"
import { handleApiError, logRequest } from "@/lib/core/error-handler"
import type { AuthContext } from "@/lib/config/middleware"

export class AppointmentController {
    static async getById(request: NextRequest, context: AuthContext & { params: { id: string } }) {
        try {
            logRequest(request, `/api/appointments/${context.params.id}`)

            const idValidation = validateIdParam(context.params.id)
            if (!idValidation.success) {
                return NextResponse.json({ error: idValidation.error }, { status: 400 })
            }

            const appointment = AppointmentService.getById(idValidation.id)
            return NextResponse.json(appointment)
        } catch (error) {
            return handleApiError(error)
        }
    }

    static async update(request: NextRequest, context: AuthContext & { params: { id: string } }) {
        try {
            logRequest(request, `/api/appointments/${context.params.id}`)

            const idValidation = validateIdParam(context.params.id)
            if (!idValidation.success) {
                return NextResponse.json({ error: idValidation.error }, { status: 400 })
            }

            const validation = await validateRequest(appointmentSchema.partial())(request)
            if (!validation.success) {
                return NextResponse.json({ error: validation.error }, { status: 400 })
            }

            const updated = AppointmentService.update(idValidation.id, validation.data)
            return NextResponse.json(updated)
        } catch (error) {
            return handleApiError(error)
        }
    }

    static async delete(request: NextRequest, context: AuthContext & { params: { id: string } }) {
        try {
            logRequest(request, `/api/appointments/${context.params.id}`)

            const idValidation = validateIdParam(context.params.id)
            if (!idValidation.success) {
                return NextResponse.json({ error: idValidation.error }, { status: 400 })
            }

            AppointmentService.delete(idValidation.id)
            return NextResponse.json({ message: "Appointment deleted successfully" })
        } catch (error) {
            return handleApiError(error)
        }
    }
}
