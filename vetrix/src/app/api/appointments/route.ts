import { requireAnyRole } from "@/lib/config/middleware"
import { AppointmentController } from "./controller"

export const GET = requireAnyRole(AppointmentController.getAll)
export const POST = requireAnyRole(AppointmentController.create)