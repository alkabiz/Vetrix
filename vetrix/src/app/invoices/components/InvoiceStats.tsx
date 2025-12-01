import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt, DollarSign, Clock, AlertCircle } from "lucide-react"
import { InvoiceDTO } from "@/lib/api/types/invoice.types"

interface InvoiceStatsProps {
    invoices: InvoiceDTO[]
}

export function InvoiceStats({ invoices }: InvoiceStatsProps) {
    const stats = {
        total: invoices.length,
        pending: invoices.filter((i) => i.status === "pending").length,
        paid: invoices.filter((i) => i.status === "paid").length,
        overdue: invoices.filter((i) => i.status === "overdue").length,
        totalRevenue: invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.totalAmount, 0),
        pendingAmount: invoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.totalAmount, 0),
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de facturas</CardTitle>
                    <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">Todas las facturas</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos totales</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground">{stats.paid} facturas pagadas</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pendiente</CardTitle>
                    <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{formatCurrency(stats.pendingAmount)}</div>
                    <p className="text-xs text-muted-foreground">{stats.pending} facturas pendientes</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vencido</CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                    <p className="text-xs text-muted-foreground">Requiere atención</p>
                </CardContent>
            </Card>
        </div>
    )
}
