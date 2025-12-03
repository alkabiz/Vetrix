import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus } from "lucide-react"
import { OwnerDTO } from "@/lib/api/types/owner.types"

interface OwnerStatsProps {
    owners: OwnerDTO[]
}

export function OwnerStats({ owners }: OwnerStatsProps) {
    const totalOwners = owners.length

    // Calculate owners created in the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newOwners = owners.filter(owner => {
        const createdDate = new Date(owner.createdAt)
        return createdDate >= thirtyDaysAgo
    }).length

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Owners
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalOwners}</div>
                    <p className="text-xs text-muted-foreground">
                        Active registered owners
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        New Owners
                    </CardTitle>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{newOwners}</div>
                    <p className="text-xs text-muted-foreground">
                        In the last 30 days
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
