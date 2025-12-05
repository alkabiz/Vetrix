import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { DollarSign, FileText, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * AssistantTasks - Assistant-specific widget showing pending tasks
 */
export function AssistantTasks() {
    const { data: invoices, isLoading: invoicesLoading } = useQuery({
        queryKey: ["invoices", "pending"],
        queryFn: async () => {
            const response = await axios.get<{ invoices: any[] }>("/api/invoices")
            return response.data.invoices.filter((inv: any) => inv.status === "pending" || inv.status === "Pending")
        },
    })

    const { data: appointments, isLoading: appointmentsLoading } = useQuery({
        queryKey: ["appointments", "upcoming"],
        queryFn: async () => {
            const response = await axios.get<{ appointments: any[] }>("/api/appointments")
            const now = new Date()
            return response.data.appointments.filter((apt: any) => new Date(apt.date || apt.appointmentDate) > now).slice(0, 3)
        },
    })

    if (invoicesLoading || appointmentsLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Tareas pendientes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        )
    }

    const pendingInvoicesCount = invoices?.length || 0
    const upcomingAppointmentsCount = appointments?.length || 0

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Tareas pendientes
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <DollarSign className="h-4 w-4 text-amber-600" />
                                <span className="font-medium text-amber-900">Facturas pendientes</span>
                            </div>
                            <div className="text-2xl font-bold text-amber-900">{pendingInvoicesCount}</div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-blue-900">Próximas citas</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-900">{upcomingAppointmentsCount}</div>
                        </div>
                    </div>
                </div>

                {appointments && appointments.length > 0 && (
                    <div className="pt-2 border-t">
                        <div className="text-sm font-medium mb-2">Próximas citas:</div>
                        <div className="space-y-2">
                            {appointments.map((apt: any, idx: number) => (
                                <div key={idx} className="text-sm">
                                    <span className="font-medium">{apt.petName || "Pet"}</span>
                                    <span className="text-muted-foreground"> - {new Date(apt.date || apt.appointmentDate).toLocaleDateString("es")}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
