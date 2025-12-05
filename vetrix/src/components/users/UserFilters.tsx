import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface UserFiltersProps {
    roleFilter: string
    onRoleFilterChange: (role: string) => void
    searchTerm: string
    onSearchChange: (term: string) => void
}

/**
 * UserFilters - Filtering controls for users list
 * Provides role filter dropdown and search input
 */
export function UserFilters({
    roleFilter,
    onRoleFilterChange,
    searchTerm,
    onSearchChange
}: UserFiltersProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by username or email..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <Select value={roleFilter} onValueChange={onRoleFilterChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="1">Admins</SelectItem>
                    <SelectItem value="2">Veterinarians</SelectItem>
                    <SelectItem value="3">Assistants</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
