import { NextRequest, NextResponse } from "next/server"
import { InvoiceService } from "./service"
import { handleApiError } from "@/lib/utils/error-handler"
import { AppError } from "@/lib/core/errors/api-errors"

export class InvoiceController {
    private service: InvoiceService

    constructor() {
        this.service = new InvoiceService()
    }

    get = async (request: NextRequest, { params }: { params: { id: string } }) => {
        try {
            const invoice = this.service.getInvoice(params.id)
            return NextResponse.json(invoice)
        } catch (error) {
            return this.handleError(error)
        }
    }

    put = async (request: NextRequest, { params }: { params: { id: string } }) => {
        try {
            const body = await request.json()
            const invoice = this.service.updateInvoice(params.id, body)
            return NextResponse.json(invoice)
        } catch (error) {
            return this.handleError(error)
        }
    }

    delete = async (request: NextRequest, { params }: { params: { id: string } }) => {
        try {
            this.service.deleteInvoice(params.id)
            return NextResponse.json({ message: "Invoice deleted successfully" })
        } catch (error) {
            return this.handleError(error)
        }
    }

    private handleError(error: unknown) {
        // Integrate with existing error handler or use custom one
        // The existing handleApiError in lib/utils/error-handler.ts handles standard errors.
        // Our custom AppError classes map to standard HTTP codes.
        // We can adapt AppError to work with handleApiError or just return NextResponse directly.

        if (error instanceof AppError) {
            return NextResponse.json({ error: error.message, code: error.code }, { status: error.statusCode })
        }

        return handleApiError(error)
    }
}
