import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { InvoiceDTO } from "@/lib/api/types/invoice.types"

interface InvoicesTableProps {
    invoices: InvoiceDTO[]
    onAdd: () => void
    onEdit: (invoice: InvoiceDTO) => void
    onDelete: (invoice: InvoiceDTO) => void
    filterStatus: string
}

export function InvoicesTable({ invoices, onAdd, onEdit, onDelete, filterStatus }: InvoicesTableProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="default" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Pendiente
                    </Badge>
                )
            case "paid":
                return (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3" />
                        Pagado
                    </Badge>
                )
            case "overdue":
                return (
                    <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Vencido
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)
    }

    const columns = [
        {
            key: "invoiceDate",
            label: "Date",
            render: (value: string) => formatDate(value),
        },
        { key: "owner_name", label: "Owner" },
        { key: "pet_name", label: "Pet" },
        {
            key: "totalAmount",
            label: "Amount",
            render: (value: number) => <div className="font-medium">{formatCurrency(value)}</div>,
        },
        {
            key: "status",
            label: "Status",
            render: (value: string) => getStatusBadge(value),
        },
    ]

    return (
        <DataTable
            title="Invoice Records"
            description={`${invoices.length} invoice${invoices.length !== 1 ? "s" : ""} ${filterStatus !== "all" ? `with ${filterStatus} status` : ""}`}
            data={invoices}
            columns={columns}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            searchPlaceholder="Search invoices..."
            addButtonText="Create Invoice"
        />
    )
}
