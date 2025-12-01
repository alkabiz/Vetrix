import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface InvoiceFiltersProps {
    currentFilter: string
    onFilterChange: (value: string) => void
}

export function InvoiceFilters({ currentFilter, onFilterChange }: InvoiceFiltersProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <label htmlFor="status-filter" className="text-sm font-medium">
                    Filtrar por estado:
                </label>
                <Select value={currentFilter} onValueChange={onFilterChange}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todo el estado</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="paid">Pagado</SelectItem>
                        <SelectItem value="overdue">Vencido</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
