"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AppointmentFiltersProps {
    statusFilter: string
    onStatusChange: (value: string) => void
}

export function AppointmentFilters({ statusFilter, onStatusChange }: AppointmentFiltersProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <label htmlFor="status-filter" className="text-sm font-medium">
                    Filtrar por estado:
                </label>
                <Select value={statusFilter} onValueChange={onStatusChange}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todo el estado</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="completed">Terminado</SelectItem>
                        <SelectItem value="canceled">Cancelado</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
