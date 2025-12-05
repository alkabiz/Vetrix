import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Loader2 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

type DateRange = "7d" | "30d" | "90d"

/**
 * DashboardRevenueTrend - Revenue trend chart with date range filter
 */
export function DashboardRevenueTrend() {
    const [dateRange, setDateRange] = useState<DateRange>("30d")

    const { data: invoices, isLoading } = useQuery({
        queryKey: ["invoices", "all"],
        queryFn: async () => {
            const response = await axios.get<{ invoices: any[] }>("/api/invoices")
            return response.data.invoices
        },
    })

    const getRevenueData = () => {
        if (!invoices) return []

        const now = new Date()
        const daysMap: Record<DateRange, number> = { "7d": 7, "30d": 30, "90d": 90 }
        const days = daysMap[dateRange]

        // Group invoices by date
        const revenueByDate: Record<string, number> = {}

        invoices
            .filter((inv) => inv.status === "paid" || inv.status === "Paid")
            .forEach((inv) => {
                const invoiceDate = new Date(inv.createdAt || inv.date)
                const daysDiff = Math.floor((now.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24))

                if (daysDiff <= days) {
                    const dateKey = invoiceDate.toISOString().split("T")[0]
                    revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + (inv.totalAmount || 0)
                }
            })

        // Convert to array and sort
        return Object.entries(revenueByDate)
            .map(([date, revenue]) => ({
                date: new Date(date).toLocaleDateString("es", { month: "short", day: "numeric" }),
                revenue,
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-Math.min(days, 14)) // Show max 14 data points for readability
    }

    const data = getRevenueData()
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Tendencia de ingresos
                        </CardTitle>
                        <CardDescription>Ingresos de facturas pagadas</CardDescription>
                    </div>
                    <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Últimos 7 días</SelectItem>
                            <SelectItem value="30d">Últimos 30 días</SelectItem>
                            <SelectItem value="90d">Últimos 90 días</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        <p>No hay datos de ingresos para este período</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Total en período seleccionado</p>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="date" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "6px",
                                    }}
                                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Ingresos"]}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
