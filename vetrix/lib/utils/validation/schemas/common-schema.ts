import { z } from "zod"

// Common schemas used across multiple entities
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a valid number"),
})

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("asc"),
})

export const dateRangeSchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
})

export const searchSchema = z.object({
  query: z.string().min(1, "Search query is required").max(255),
})

// Type inference
export type IdParam = z.infer<typeof idParamSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type DateRangeInput = z.infer<typeof dateRangeSchema>
export type SearchInput = z.infer<typeof searchSchema>