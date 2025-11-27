import { requireAnyRole, requireVetOrAdmin } from "@/lib/config/middleware"
import { InvoiceController } from "./controller"

const controller = new InvoiceController()

export const GET = requireAnyRole(controller.get)
export const PUT = requireVetOrAdmin(controller.put)
export const DELETE = requireVetOrAdmin(controller.delete)
