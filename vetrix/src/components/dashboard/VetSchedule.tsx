import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Calendar, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * VetSchedule - Vet-specific widget showing today's appointments
 */
export function VetSchedule() {
    const { data: appointments, isLoading } = useQuery({
        queryKey: ["appointments", "today-detailed"],
        queryFn: async () => {
            const today = new Date().toISOString().split("T")[0]
            const response = await axios.get<{ appointments: any[] }>(`/api/appointments?date=${today}`)
            return response.data.appointments.slice(0, 5) // Show max 5
        },
    })

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Agenda de hoy
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Agenda de hoy
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {appointments && appointments.length > 0 ? (
                    appointments.map((apt, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                            <div className="flex-1">
                                <div className="font-medium">{apt.petName || "Pet"}</div>
                                <div className="text-sm text-muted-foreground">{apt.reason || apt.appointmentReason || "Consulta general"}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {apt.time || apt.appointmentTime || "N/A"}
                                </div>
                                <Badge variant={apt.status === "pending" ? "secondary" : "outline"}>{apt.status || "Pending"}</Badge>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">No tienes citas programadas para hoy</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
