import { requireAdmin } from "@/lib/config/middleware"
import { UserController } from "../../controller"

// Bulk role change endpoint
export const POST = requireAdmin(UserController.bulkRoleChange)
