"use client"

import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Heart } from "lucide-react"
import type { AppointmentDTO } from "@/lib/api/types/appointment.types"

interface AppointmentsTableProps {
    appointments: AppointmentDTO[]
    isLoading: boolean
    onAdd?: () => void
    onEdit?: (appointment: AppointmentDTO) => void
    onDelete?: (appointment: AppointmentDTO) => void
    statusFilter: string
}

export function AppointmentsTable({
    appointments,
    isLoading,
    onAdd,
    onEdit,
    onDelete,
    statusFilter,
}: AppointmentsTableProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge variant="default">Pendiente</Badge>
            case "completed":
                return <Badge variant="secondary">Terminado</Badge>
            case "canceled":
                return <Badge variant="destructive">Cancelado</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const formatTime = (timeStr: string) => {
        return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
    }

    const columns = [
        {
            key: "date",
            label: "Date",
            render: (value: string) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(value)}
                </div>
            ),
        },
        {
            key: "time",
            label: "Time",
            render: (value: string) => (
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {formatTime(value)}
                </div>
            ),
        },
        {
            key: "ownerName",
            label: "Owner",
            render: (value: string) => (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {value || "Unknown"}
                </div>
            ),
        },
        {
            key: "petName",
            label: "Pet",
            render: (value: string) => (
                <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    {value || "Unknown"}
                </div>
            ),
        },
        { key: "veterinarianName", label: "Veterinarian" },
        {
            key: "status",
            label: "Status",
            render: (value: string) => getStatusBadge(value),
        },
    ]

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Cargando citas...</div>
            </div>
        )
    }

    return (
        <DataTable
            title="Scheduled Appointments"
            description={`${appointments.length} appointment${appointments.length !== 1 ? "s" : ""} ${statusFilter !== "all" ? `with ${statusFilter} status` : ""
                }`}
            data={appointments}
            columns={columns}
            onAdd={onAdd}
            onEdit={onEdit}
            onDelete={onDelete}
            searchPlaceholder="Buscar citas..."
            addButtonText="Programar cita"
        />
    )
}
