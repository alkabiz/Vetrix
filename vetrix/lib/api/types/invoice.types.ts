import { Invoice } from "@/lib/database/database"

export interface InvoiceEntity extends Omit<Invoice, 'status'> {
    status: "pending" | "paid" | "overdue" | "cancelled"
}

export interface InvoiceDTO extends InvoiceEntity {
    owner_name?: string
    pet_name?: string
}

