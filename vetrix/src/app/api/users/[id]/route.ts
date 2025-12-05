import { requireAdmin } from "@/lib/config/middleware"
import { UserController } from "../controller"

// Dynamic route for individual user operations
export const GET = requireAdmin(UserController.getById)
export const PUT = requireAdmin(UserController.update)
export const DELETE = requireAdmin(UserController.delete)
