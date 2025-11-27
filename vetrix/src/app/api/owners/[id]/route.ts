import { requireAnyRole, requireVetOrAdmin } from "@/lib/config/middleware"
import { OwnerController } from "../controller"

export const GET = requireAnyRole(OwnerController.getById)
export const PUT = requireAnyRole(OwnerController.update)
export const DELETE = requireVetOrAdmin(OwnerController.delete)
