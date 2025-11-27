import { invoiceSchema } from "@/lib/utils/validation/schemas/invoice-schema"
import { z } from "zod"

export const invoiceUpdateSchema = invoiceSchema.partial()

export type InvoiceUpdateInput = z.infer<typeof invoiceUpdateSchema>

export class InvoiceValidator {
    static validateUpdate(data: unknown) {
        return invoiceUpdateSchema.safeParse(data)
    }
}
