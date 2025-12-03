"use client"

import { PetDTO } from "@/lib/api/types/pet.types"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"

interface PetsTableProps {
    pets: PetDTO[]
    onEdit?: (pet: PetDTO) => void
    onDelete?: (pet: PetDTO) => void
}

export function PetsTable({ pets, onEdit, onDelete }: PetsTableProps) {
    const columns = [
        {
            key: "name",
            label: "Pet Name"
        },
        {
            key: "owner_name",
            label: "Owner"
        },
        {
            key: "species_name",
            label: "Species"
        },
        {
            key: "breed_name",
            label: "Breed",
            render: (value: string | undefined) => value || "-"
        },
        {
            key: "sex_name",
            label: "Sex",
            render: (value: string | undefined, row: PetDTO) => {
                if (!value) return <Badge variant="outline">Unknown</Badge>

                const variant = value.toLowerCase() === "male"
                    ? "default"
                    : value.toLowerCase() === "female"
                        ? "secondary"
                        : "outline"

                return <Badge variant={variant}>{value}</Badge>
            },
        },
        {
            key: "age",
            label: "Age",
            render: (value: number | undefined) => value !== undefined ? `${value} years` : "-"
        },
        {
            key: "isActive",
            label: "Status",
            render: (value: boolean) => (
                <Badge variant={value ? "default" : "outline"}>
                    {value ? "Active" : "Inactive"}
                </Badge>
            ),
        },
    ]

    return (
        <DataTable
            title="Registered Pets"
            description="All pets registered in the system"
            data={pets}
            columns={columns}
            onEdit={onEdit}
            onDelete={onDelete}
            searchPlaceholder="Search pets..."
            addButtonText="Add Pet"
        />
    )
}
