import { requireAnyRole } from "@/lib/config/middleware"
import { InvoiceController } from "./controller"

export const GET = requireAnyRole(InvoiceController.getAll)
export const POST = requireAnyRole(InvoiceController.create)
