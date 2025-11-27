import { requireAnyRole, requireVetOrAdmin } from "@/lib/config/middleware"
import { PetController } from "../controller"

export const GET = requireAnyRole(PetController.getById)
export const PUT = requireVetOrAdmin(PetController.update)
export const DELETE = requireVetOrAdmin(PetController.delete)
