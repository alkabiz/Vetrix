import { getVeterinarianById, updateVeterinarian, deleteVeterinarian } from "../controller"
import { requireAdmin } from "@/lib/config/middleware"

export const GET = getVeterinarianById
export const PUT = requireAdmin(updateVeterinarian)
export const DELETE = requireAdmin(deleteVeterinarian)