import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Users, Shield, AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * AdminMetrics - Admin-specific metrics (user counts, system health)
 */
export function AdminMetrics() {
    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ["users", "all"],
        queryFn: async () => {
            const response = await axios.get<{ users: any[] }>("/api/users")
            return response.data.users
        },
    })

    if (usersLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Métricas del sistema
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </CardContent>
            </Card>
        )
    }

    const adminCount = users?.filter((u) => u.roleId === 1).length || 0
    const vetCount = users?.filter((u) => u.roleId === 2).length || 0
    const assistantCount = users?.filter((u) => u.roleId === 3).length || 0
    const activeCount = users?.filter((u) => u.statusId === 1).length || 0

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Métricas del sistema
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Total Usuarios</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900">{users?.length || 0}</div>
                        <div className="text-xs text-blue-700 mt-1">{activeCount} activos</div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-900">Administradores</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-900">{adminCount}</div>
                        {adminCount === 1 && (
                            <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                                <AlertTriangle className="h-3 w-3" />
                                Último admin
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-sm font-medium text-green-900 mb-2">Veterinarios</div>
                        <div className="text-2xl font-bold text-green-900">{vetCount}</div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="text-sm font-medium text-amber-900 mb-2">Asistentes</div>
                        <div className="text-2xl font-bold text-amber-900">{assistantCount}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
