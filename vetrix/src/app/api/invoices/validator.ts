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

export type InvoiceInput = z.infer<typeof invoiceSchema>

export async function validateInvoice(request: Request): Promise<InvoiceInput> {
    const body = await request.json()
    return invoiceSchema.parse(body)
}
