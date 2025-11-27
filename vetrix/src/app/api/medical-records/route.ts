import { requireAnyRole, requireVetOrAdmin } from "@/lib/config/middleware"
import { MedicalRecordController } from "./controller"

export const GET = requireAnyRole(MedicalRecordController.getAll)
export const POST = requireVetOrAdmin(MedicalRecordController.getById)
