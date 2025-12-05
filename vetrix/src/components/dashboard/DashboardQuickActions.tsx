import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Heart, Calendar, FileText, UserCog, Plus, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useDashboardData } from "@/src/hooks/useDashboardData"
import type { User } from "@/lib/database/database"

interface QuickAction {
    href: string
    icon: any
    title: string
    color: string
    count?: number
}

interface DashboardQuickActionsProps {
    user: User | null
}

/**
 * DashboardQuickActions - Role-based quick action links with dynamic counts
 */
export function DashboardQuickActions({ user }: DashboardQuickActionsProps) {
    // Fetch dashboard data
    const { stats } = useDashboardData()
    const appointmentsData = stats.todayAppointments

    if (!user) return null

    const getRoleSpecificActions = (): QuickAction[] => {
        const baseActions: QuickAction[] = [
            {
                href: "/owners",
                icon: Users,
                title: "Registrar un nuevo propietario",
                color: "blue",
            },
            {
                href: "/pets",
                icon: Heart,
                title: "Añadir una nueva mascota",
                color: "pink",
            },
            {
                href: "/appointments",
                icon: Calendar,
                title: "Programar una cita",
                color: "orange",
                count: appointmentsData,
            },
        ]

        const actions = [...baseActions]

        // Add role-specific actions
        if (user.roleId === 1) {
            actions.push({
                href: "/users",
                icon: UserCog,
                title: "Administrar usuarios",
                color: "purple",
            })
        }

        if ([1, 2].includes(user.roleId)) {
            actions.push({
                href: "/medical-records",
                icon: FileText,
                title: "Crear expediente médico",
                color: "green",
            })
        }

        return actions
    }

    const actions = getRoleSpecificActions()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Acciones rápidas
                </CardTitle>
                <CardDescription>
                    {user.roleId === 1 ? "Administrative and management tasks" : "Common tasks to get you started"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        href={action.href}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 bg-${action.color}-100 rounded-lg group-hover:bg-${action.color}-200 transition-colors`}>
                                <action.icon className={`h-4 w-4 text-${action.color}-600`} />
                            </div>
                            <span className="font-medium">{action.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {action.count && action.count > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                    {action.count} hoy
                                </Badge>
                            )}
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    )
}
