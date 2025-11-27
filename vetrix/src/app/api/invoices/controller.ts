import { type NextRequest, NextResponse } from "next/server"
import { InvoiceService } from "./service"
import { validateInvoice } from "./validator"
import { handleApiError, logRequest } from "@/lib/core/error-handler"

export class InvoiceController {
    static async getAll(request: NextRequest) {
        try {
            logRequest(request, "/api/invoices")
            const invoices = InvoiceService.getAll()
            return NextResponse.json(invoices)
        } catch (error) {
            return handleApiError(error)
        }
    }

    static async create(request: NextRequest) {
        try {
            logRequest(request, "/api/invoices")
            const data = await validateInvoice(request)
            const newInvoice = InvoiceService.create(data)
            return NextResponse.json(newInvoice, { status: 201 })
        } catch (error) {
            return handleApiError(error)
        }
    }
}
