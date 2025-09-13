"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Download, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "./empty-state"
import { TableSkeleton } from "./loading-skeleton"

interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface EnhancedDataTableProps {
  title: string
  data: any[]
  columns: Column[]
  loading?: boolean
  searchPlaceholder?: string
  onAdd?: () => void
  onEdit?: (item: any) => void
  onDelete?: (item: any) => void
  addButtonLabel?: string
  filters?: {
    key: string
    label: string
    options: { value: string; label: string }[]
  }[]
}

export function EnhancedDataTable({
  title,
  data,
  columns,
  loading = false,
  searchPlaceholder = "Search...",
  onAdd,
  onEdit,
  onDelete,
  addButtonLabel = "Add New",
  filters = [],
}: EnhancedDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  // Filter and search data
  const filteredData = data.filter((item) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))

    // Active filters
    const matchesFilters = Object.entries(activeFilters).every(([key, value]) => {
      if (!value) return true
      return String(item[key]).toLowerCase() === value.toLowerCase()
    })

    return matchesSearch && matchesFilters
  })

  if (loading) {
    return <TableSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header with search and actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">
            {filteredData.length} {filteredData.length === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="flex gap-2">
          {onAdd && (
            <Button onClick={onAdd} className="gap-2">
              <Search className="h-4 w-4" />
              {addButtonLabel}
            </Button>
          )}
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={activeFilters[filter.key] || "all"}
            onValueChange={(value) => setActiveFilters((prev) => ({ ...prev, [filter.key]: value }))}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos {filter.label}</SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      {/* Data table */}
      {filteredData.length === 0 ? (
        <EmptyState
          title="No se encontraron datos."
          description={
            searchTerm || Object.keys(activeFilters).length > 0
              ? "Intenta ajustar tu búsqueda o filtros."
              : `No ${title.toLowerCase()} aún no se han añadido`
          }
          action={onAdd ? { label: addButtonLabel, onClick: onAdd } : undefined}
          icon={searchTerm || Object.keys(activeFilters).length > 0 ? "search" : "add"}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key} className="text-left p-4 font-medium">
                        {column.label}
                      </th>
                    ))}
                    {(onEdit || onDelete) && <th className="text-right p-4 font-medium">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                      {columns.map((column) => (
                        <td key={column.key} className="p-4">
                          {column.render ? column.render(item[column.key], item) : item[column.key]}
                        </td>
                      ))}
                      {(onEdit || onDelete) && (
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {onEdit && (
                                <DropdownMenuItem onClick={() => onEdit(item)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                              )}
                              {onDelete && (
                                <DropdownMenuItem onClick={() => onDelete(item)} className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
