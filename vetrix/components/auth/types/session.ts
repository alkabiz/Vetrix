import { z } from "zod"

export const sessionSchema = z.object({
    id: z.string(),
    ipAddress: z.string(),
    userAgent: z.string(),
    createdAt: z.string(),
    lastActivity: z.string(),
    isActive: z.boolean(),
    isCurrent: z.boolean().optional(),
})

export type LoginSession = z.infer<typeof sessionSchema>

export const sessionResponseSchema = z.object({
    sessions: z.array(sessionSchema),
})
