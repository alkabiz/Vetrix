import { createVeterinarian, getVeterinarians } from "./controller"
import { requireAdmin } from "@/lib/config/middleware"

export const GET = getVeterinarians
export const POST = requireAdmin(createVeterinarian)