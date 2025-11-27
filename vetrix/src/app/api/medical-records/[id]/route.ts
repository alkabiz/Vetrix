import { requireMedicalAccess, requireVetOrAdmin } from "@/lib/config/middleware"
import { MedicalRecordController } from "../controller"

export const GET = requireMedicalAccess(MedicalRecordController.getById)
export const PUT = requireVetOrAdmin(MedicalRecordController.update)
export const DELETE = requireVetOrAdmin(MedicalRecordController.delete)
