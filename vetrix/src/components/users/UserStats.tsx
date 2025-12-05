import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCog, Shield, UserCheck, Users } from "lucide-react"
import { UserDTO } from "@/lib/api/types/user.types"

interface UserStatsProps {
    users: UserDTO[]
}

/**
 * UserStats - Displays user statistics in cards
 * Shows total users, admins, vets, and assistants counts
 */
export function UserStats({ users }: UserStatsProps) {
    const stats = {
        total: users.length,
        admins: users.filter((u) => u.roleId === 1).length,
        vets: users.filter((u) => u.roleId === 2).length,
        assistants: users.filter((u) => u.roleId === 3).length,
    }

    return (
        <div className="grid gap-4 md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de usuarios</CardTitle>
                    <UserCog className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground">Usuarios activos del sistema</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                    <Shield className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
                    <p className="text-xs text-muted-foreground">Usuarios con acceso completo</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Veterinarios</CardTitle>
                    <UserCheck className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.vets}</div>
                    <p className="text-xs text-muted-foreground">Profesionales médicos</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Asistentes</CardTitle>
                    <Users className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.assistants}</div>
                    <p className="text-xs text-muted-foreground">Personal de apoyo</p>
                </CardContent>
            </Card>
        </div>
    )
}
