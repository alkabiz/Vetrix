import { requireAdmin } from "@/lib/config/middleware"
import { UserController } from "../controller"

// Audit logs endpoint
export const GET = requireAdmin(UserController.getAuditLogs)
