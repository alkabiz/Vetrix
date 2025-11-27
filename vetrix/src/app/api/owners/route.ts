import { requireAnyRole } from "@/lib/config/middleware"
import { OwnerController } from "./controller"

export const GET = requireAnyRole(OwnerController.getAll)
export const POST = requireAnyRole(OwnerController.create)
