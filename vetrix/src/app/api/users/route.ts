import { requireAdmin } from "@/lib/config/middleware"
import { UserController } from "./controller"

export const GET = requireAdmin(UserController.getAll)
