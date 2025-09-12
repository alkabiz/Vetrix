"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus } from "lucide-react"

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (value: any, item: T) => React.ReactNode
}

interface DataTableProps<T> {
  title: string
  description?: string
  data: T[]
  columns: Column<T>[]
  onAdd?: () => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  searchPlaceholder?: string
  addButtonText?: string
}

export function DataTable<T extends Record<string, any>>({
  title,
  description,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  searchPlaceholder = "Search...",
  addButtonText = "Add New",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getValue = (item: T, key: string) => {
    return key.includes(".") ? key.split(".").reduce((obj, k) => obj?.[k], item) : item[key]
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {onAdd && (
            <Button onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              {addButtonText}
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={String(column.key)}>{column.label}</TableHead>
                ))}
                {(onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center py-8">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={item.id || index}>
                    {columns.map((column) => (
                      <TableCell key={String(column.key)}>
                        {column.render
                          ? column.render(getValue(item, String(column.key)), item)
                          : getValue(item, String(column.key))}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {onEdit && (
                            <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                              Edit
                            </Button>
                          )}
                          {onDelete && (
                            <Button variant="destructive" size="sm" onClick={() => onDelete(item)}>
                              Delete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
