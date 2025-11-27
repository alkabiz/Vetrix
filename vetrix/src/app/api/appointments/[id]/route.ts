import { requireAnyRole, requireVetOrAdmin } from "@/lib/config/middleware"
import { AppointmentController } from "./controller"

export const GET = requireAnyRole<{ params: { id: string } }>(AppointmentController.getById)
export const PUT = requireVetOrAdmin<{ params: { id: string } }>(AppointmentController.update)
export const DELETE = requireVetOrAdmin<{ params: { id: string } }>(AppointmentController.delete)