"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"

interface AppointmentStatsProps {
    stats: {
        total: number
        pending: number
        completed: number
        canceled: number
    }
}

export function AppointmentStats({ stats }: AppointmentStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pendiente</CardTitle>
                    <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Terminado</CardTitle>
                    <div className="h-4 w-4 rounded-full bg-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cancelado</CardTitle>
                    <div className="h-4 w-4 rounded-full bg-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.canceled}</div>
                </CardContent>
            </Card>
        </div>
    )
}
