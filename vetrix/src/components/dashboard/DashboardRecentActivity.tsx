import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity } from "lucide-react"
import { useDashboardData } from "@/src/hooks/useDashboardData"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

/**
 * DashboardRecentActivity - Shows real activity from audit logs
 */
export function DashboardRecentActivity() {
    const { recentActivity: logs, isLoading } = useDashboardData()

    const getActivityColor = (action: string) => {
        switch (action) {
            case "user_created":
            case "user_updated":
                return { bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500" }
            case "user_deleted":
            case "bulk_delete":
                return { bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" }
            case "bulk_role_change":
                return { bg: "bg-purple-50", border: "border-purple-200", dot: "bg-purple-500" }
            default:
                return { bg: "bg-green-50", border: "border-green-200", dot: "bg-green-500" }
        }
    }

    const getActivityLabel = (action: string) => {
        const labels: Record<string, string> = {
            user_created: "Usuario creado",
            user_updated: "Usuario actualizado",
            user_deleted: "Usuario eliminado",
            bulk_delete: "Eliminación masiva",
            bulk_role_change: "Cambio de rol masivo",
        }
        return labels[action] || action
    }

    const getActivityDescription = (log: any) => {
        try {
            const details = log.details ? JSON.parse(log.details) : {}

            switch (log.action) {
                case "user_created":
                    return `Nuevo usuario creado`
                case "user_updated":
                    return `Usuario actualizado`
                case "user_deleted":
                    return `Usuario ${details.username || "desconocido"} eliminado`
                case "bulk_delete":
                    return `${details.count || 0} usuarios eliminados`
                case "bulk_role_change":
                    return `Rol cambiado para ${details.count || 0} usuarios`
                default:
                    return log.action
            }
        } catch {
            return log.action
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Actividad reciente
                </CardTitle>
                <CardDescription>Últimas actualizaciones en su sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-start gap-4 p-3 rounded-lg">
                                <Skeleton className="h-2 w-2 rounded-full mt-2" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </>
                ) : logs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">No hay actividad reciente</p>
                    </div>
                ) : (
                    logs.map((log) => {
                        const colors = getActivityColor(log.action)
                        return (
                            <div key={log.id} className={`flex items-start gap-4 p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                                <div className={`h-2 w-2 rounded-full ${colors.dot} mt-2`} />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-sm">{getActivityDescription(log)}</p>
                                        <Badge variant="secondary" className="text-xs">
                                            {getActivityLabel(log.action)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-muted-foreground text-xs">
                                            {log.performedByUsername && `Por ${log.performedByUsername}`}
                                        </p>
                                        {log.createdAt && (
                                            <p className="text-muted-foreground text-xs">
                                                • {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: es })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </CardContent>
        </Card>
    )
}
