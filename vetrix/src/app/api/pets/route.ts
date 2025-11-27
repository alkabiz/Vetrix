import { requireAnyRole } from "@/lib/config/middleware"
import { PetController } from "./controller"

export const GET = requireAnyRole(PetController.getAll)
export const POST = requireAnyRole(PetController.create)
