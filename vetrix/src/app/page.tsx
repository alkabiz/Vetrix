"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Heart, Calendar, FileText, TrendingUp, Plus, ArrowUpRight, Activity, UserCog } from "lucide-react"
import Link from "next/link"
import { AuthWrapper } from "@/components/auth-wrapper"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  const getWelcomeMessage = () => {
    if (!user) return "Bienvenido a Vetrix Pro"

    const timeOfDay = new Date().getHours() < 12 ? "mañana" : new Date().getHours() < 18 ? "tarde" : "tarde"
    return `Bien ${timeOfDay}, ${user.username}`
  }

  const getRoleSpecificActions = () => {
    if (!user) return []

    const baseActions = [
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
      },
    ]

    // Add role-specific actions
    if (user.role === "admin") {
      baseActions.push({
        href: "/users",
        icon: UserCog,
        title: "Administrar usuarios",
        color: "purple",
      })
    }

    if (["admin", "vet"].includes(user.role)) {
      baseActions.push({
        href: "/medical-records",
        icon: FileText,
        title: "Crear expediente médico",
        color: "green",
      })
    }

    return baseActions
  }

  return (
    <AuthWrapper>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{getWelcomeMessage()}</h1>
              <p className="text-muted-foreground">
                {user?.role === "admin"
                  ? "Administra tu clínica veterinaria con acceso administrativo completo."
                  : user?.role === "vet"
                    ? "Esto es lo que está sucediendo hoy en su clínica"
                    : "Bienvenido al sistema de gestión veterinaria."}
              </p>
            </div>
            <Button className="gap-2" asChild>
              <Link href="/appointments">
                <Plus className="h-4 w-4" />
                Nuevo nombramiento
              </Link>
            </Button>
          </div>

          {/* Role-specific stats or info */}
          {user?.role === "admin" && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Panel de control del administrador</CardTitle>
                <CardDescription className="text-blue-700">
                  Tienes acceso completo a todas las funciones del sistema, incluyendo la administración de usuarios y la configuración del sistema.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {user?.role === "assistant" && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">Panel de control del asistente</CardTitle>
                <CardDescription className="text-green-700">
                  Puede administrar citas, propietarios, mascotas y facturas. Los registros médicos son solo de lectura.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de propietarios</CardTitle>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  Clientes activos en el sistema
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de mascotas</CardTitle>
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Heart className="h-4 w-4 text-pink-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  Pacientes bajo atención médica
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Citas de hoy</CardTitle>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3 text-orange-500" />
                  Citas pendientes
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos mensuales</CardTitle>
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$435</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  +12 % respecto al mes pasado
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions and Recent Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Acciones rápidas
                </CardTitle>
                <CardDescription>
                  {user?.role === "admin" ? "Administrative and management tasks" : "Common tasks to get you started"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {getRoleSpecificActions().map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 bg-${action.color}-100 rounded-lg group-hover:bg-${action.color}-200 transition-colors`}
                      >
                        <action.icon className={`h-4 w-4 text-${action.color}-600`} />
                      </div>
                      <span className="font-medium">{action.title}</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Actividad reciente
                </CardTitle>
                <CardDescription>Últimas actualizaciones en su sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">Buddy: revisión anual completada.</p>
                      <Badge variant="secondary" className="text-xs">
                        Terminado
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1">Hace 2 horas</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">Nueva cita programada para Luna</p>
                      <Badge variant="outline" className="text-xs">
                        Programado
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1">Hace 1 día</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="h-2 w-2 rounded-full bg-orange-500 mt-2" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">Factura generada por la visita de Max.</p>
                      <Badge variant="outline" className="text-xs">
                        $125
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1">Hace 2 días</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </AuthWrapper>
  )
}
