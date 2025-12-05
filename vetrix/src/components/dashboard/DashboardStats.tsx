import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Heart, Calendar, TrendingUp, ArrowUpRight, Activity } from "lucide-react"
import { useDashboardStats } from "@/src/hooks/useDashboardStats"

/**
 * DashboardStats - Displays 4 key metrics with real-time data
 */
export function DashboardStats() {
    const { totalOwners, totalPets, todayAppointments, monthlyRevenue, isLoading, error } = useDashboardStats()

    if (error) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <p className="text-sm text-red-600">Error loading dashboard stats</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const stats = [
        {
            title: "Total de propietarios",
            value: totalOwners,
            icon: Users,
            description: "Clientes activos en el sistema",
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            title: "Total de mascotas",
            value: totalPets,
            icon: Heart,
            description: "Pacientes bajo atención médica",
            bgColor: "bg-pink-100",
            iconColor: "text-pink-600",
        },
        {
            title: "Citas de hoy",
            value: todayAppointments,
            icon: Calendar,
            description: "Citas programadas",
            bgColor: "bg-orange-100",
            iconColor: "text-orange-600",
        },
        {
            title: "Ingresos mensuales",
            value: `$${monthlyRevenue.toLocaleString()}`,
            icon: TrendingUp,
            description: "Facturado este mes",
            bgColor: "bg-green-100",
            iconColor: "text-green-600",
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                            <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            {index < 3 ? <ArrowUpRight className="h-3 w-3 text-green-500" /> : <Activity className="h-3 w-3 text-green-500" />}
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
