"use client"

import { PetDTO } from "@/lib/api/types/pet.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dog, Cat, Activity, PawPrint } from "lucide-react"

interface PetStatsProps {
    pets: PetDTO[]
}

export function PetStats({ pets }: PetStatsProps) {
    const totalPets = pets.length
    const activePets = pets.filter(p => p.isActive).length
    const dogs = pets.filter(p => p.species_name?.toLowerCase() === "dog").length
    const cats = pets.filter(p => p.species_name?.toLowerCase() === "cat").length
    const otherSpecies = totalPets - dogs - cats

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
                    <PawPrint className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalPets}</div>
                    <p className="text-xs text-muted-foreground">
                        Registered in system
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Pets</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activePets}</div>
                    <p className="text-xs text-muted-foreground">
                        {totalPets > 0 ? Math.round((activePets / totalPets) * 100) : 0}% of total
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dogs</CardTitle>
                    <Dog className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{dogs}</div>
                    <p className="text-xs text-muted-foreground">
                        {totalPets > 0 ? Math.round((dogs / totalPets) * 100) : 0}% of total
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cats</CardTitle>
                    <Cat className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{cats}</div>
                    <p className="text-xs text-muted-foreground">
                        {totalPets > 0 ? Math.round((cats / totalPets) * 100) : 0}% of total
                        {otherSpecies > 0 && ` (+${otherSpecies} other)`}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
