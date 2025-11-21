import { z } from "zod"

export const invoiceSchema = z.object({
  owner_id: z.number().int().positive("Owner ID must be a positive integer"),
  pet_id: z.number().int().positive("Pet ID must be a positive integer"),
  appointment_id: z.number().int().positive().optional(),
  invoice_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  services: z.string().min(1, "Services description is required").max(1000),
  total_amount: z.number().positive("Total amount must be positive").max(999999.99),
  status: z.enum(["pending", "paid", "overdue", "cancelled"]),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
})

// Extended schemas
export const invoiceCreateSchema = invoiceSchema
export const invoiceUpdateSchema = invoiceSchema.partial()
export const invoiceStatusSchema = z.object({
  status: z.enum(["pending", "paid", "overdue", "cancelled"])
})
export const invoicePaymentSchema = z.object({
  amount: z.number().positive("Amount must be positive").max(999999.99),
  payment_method: z.string().min(1, "Payment method is required"),
  reference: z.string().optional(),
})

// Type inference
export type InvoiceInput = z.infer<typeof invoiceSchema>
export type InvoiceCreateInput = z.infer<typeof invoiceCreateSchema>
export type InvoiceUpdateInput = z.infer<typeof invoiceUpdateSchema>
export type InvoicePaymentInput = z.infer<typeof invoicePaymentSchema>