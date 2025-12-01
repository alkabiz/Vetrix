import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pet } from "@/lib/database/database"

interface MedicalRecordsFiltersProps {
    currentFilter: string
    onFilterChange: (value: string) => void
    pets: Pet[]
}

export function MedicalRecordsFilters({ currentFilter, onFilterChange, pets }: MedicalRecordsFiltersProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <label htmlFor="pet-filter" className="text-sm font-medium">
                    Filtrar por mascota:
                </label>
                <Select value={currentFilter} onValueChange={onFilterChange}>
                    <SelectTrigger className="w-60">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las mascotas</SelectItem>
                        {pets.map((pet) => (
                            <SelectItem key={pet.id} value={String(pet.id)}>
                                {pet.name} ({pet.speciesId}) - {pet.owner_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
