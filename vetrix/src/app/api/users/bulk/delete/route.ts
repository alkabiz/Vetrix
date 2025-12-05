import { requireAdmin } from "@/lib/config/middleware"
import { UserController } from "../../controller"

// Bulk delete endpoint
export const POST = requireAdmin(UserController.bulkDelete)
