"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface PetFiltersProps {
    searchTerm: string
    onSearchChange: (value: string) => void
}

export function PetFilters({ searchTerm, onSearchChange }: PetFiltersProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, owner, or breed..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-8"
                />
            </div>
        </div>
    )
}
