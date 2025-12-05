import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Loader2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

type DateRange = "7d" | "30d" | "90d"

/**
 * DashboardAppointmentChart - Appointments chart with status breakdown
 */
export function DashboardAppointmentChart() {
    const [dateRange, setDateRange] = useState<DateRange>("30d")

    const { data: appointments, isLoading } = useQuery({
        queryKey: ["appointments", "all"],
        queryFn: async () => {
            const response = await axios.get<{ appointments: any[] }>("/api/appointments")
            return response.data.appointments
        },
    })

    const getAppointmentData = () => {
        if (!appointments) return []

        const now = new Date()
        const daysMap: Record<DateRange, number> = { "7d": 7, "30d": 30, "90d": 90 }
        const days = daysMap[dateRange]

        // Group by day of week
        const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
        const dataByDay: Record<string, { total: number; pending: number; completed: number; cancelled: number }> = {}

        dayNames.forEach((day) => {
            dataByDay[day] = { total: 0, pending: 0, completed: 0, cancelled: 0 }
        })

        appointments.forEach((apt) => {
            const aptDate = new Date(apt.date || apt.appointmentDate)
            const daysDiff = Math.floor((now.getTime() - aptDate.getTime()) / (1000 * 60 * 60 * 24))

            if (daysDiff <= days && daysDiff >= 0) {
                const dayName = dayNames[aptDate.getDay()]
                dataByDay[dayName].total++

                const status = (apt.status || "").toLowerCase()
                if (status.includes("pending") || status.includes("scheduled")) {
                    dataByDay[dayName].pending++
                } else if (status.includes("completed") || status.includes("done")) {
                    dataByDay[dayName].completed++
                } else if (status.includes("cancelled")) {
                    dataByDay[dayName].cancelled++
                }
            }
        })

        return dayNames.map((day) => ({
            day,
            ...dataByDay[day],
        }))
    }

    const data = getAppointmentData()
    const totalAppointments = data.reduce((sum, item) => sum + item.total, 0)

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Citas por día de semana
                        </CardTitle>
                        <CardDescription>Distribución de citas por estado</CardDescription>
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
                ) : totalAppointments === 0 ? (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        <p>No hay citas para este período</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <div className="text-2xl font-bold">{totalAppointments}</div>
                            <p className="text-xs text-muted-foreground">Total de citas en período seleccionado</p>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis dataKey="day" className="text-xs" />
                                <YAxis className="text-xs" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "6px",
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="pending" fill="hsl(43, 96%, 56%)" name="Pendientes" />
                                <Bar dataKey="completed" fill="hsl(142, 76%, 36%)" name="Completadas" />
                                <Bar dataKey="cancelled" fill="hsl(0, 84%, 60%)" name="Canceladas" />
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
