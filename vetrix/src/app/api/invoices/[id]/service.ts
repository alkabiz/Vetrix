import { InvoiceRepository } from "@/lib/database/repositories/invoice-repository"
import { InvoiceValidator } from "@/validators/invoice-validator"
import { NotFoundError, ValidationError } from "@/lib/core/errors/api-errors"
import { InvoiceDTO } from "@/lib/api/types/invoice.types"

export class InvoiceService {
    private repository: InvoiceRepository

    constructor() {
        this.repository = new InvoiceRepository()
    }

    getInvoice(id: string): InvoiceDTO {
        const numericId = this.validateId(id)
        const invoice = this.repository.findById(numericId)

        if (!invoice) {
            throw new NotFoundError("Invoice not found")
        }

        return invoice
    }

    updateInvoice(id: string, data: unknown): InvoiceDTO {
        const numericId = this.validateId(id)

        const validation = InvoiceValidator.validateUpdate(data)
        if (!validation.success) {
            throw new ValidationError(validation.error.message)
        }

        const updated = this.repository.update(numericId, validation.data)
        if (!updated) {
            throw new NotFoundError("Invoice not found")
        }

        return this.getInvoice(id)
    }

    deleteInvoice(id: string): void {
        const numericId = this.validateId(id)
        const deleted = this.repository.delete(numericId)

        if (!deleted) {
            throw new NotFoundError("Invoice not found")
        }
    }

    private validateId(id: string): number {
        const numericId = Number(id)
        if (isNaN(numericId) || numericId <= 0) {
            throw new ValidationError("Invalid ID parameter")
        }
        return numericId
    }
}
