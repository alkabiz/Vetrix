"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { useAuth } from "@/contexts/auth-context"
import { DashboardStats } from "@/src/components/dashboard/DashboardStats"
import { DashboardQuickActions } from "@/src/components/dashboard/DashboardQuickActions"
import { DashboardRecentActivity } from "@/src/components/dashboard/DashboardRecentActivity"
import { DashboardRolePanel } from "@/src/components/dashboard/DashboardRolePanel"
import { DashboardRevenueTrend } from "@/src/components/dashboard/DashboardRevenueTrend"
import { DashboardAppointmentChart } from "@/src/components/dashboard/DashboardAppointmentChart"

export default function DashboardPage() {
  const { user } = useAuth()

  const getWelcomeMessage = () => {
    if (!user) return "Bienvenido a Vetrix Pro"

    const hour = new Date().getHours()
    const timeOfDay = hour < 12 ? "mañana" : hour < 18 ? "tarde" : "noche"
    return `Buenas ${timeOfDay}, ${user.username}`
  }

  const getRoleDescription = () => {
    if (!user) return "Sistema de gestión veterinaria"

    switch (user.roleId) {
      case 1:
        return "Administra tu clínica veterinaria con acceso administrativo completo."
      case 2:
        return "Esto es lo que está sucediendo hoy en su clínica"
      default:
        return "Bienvenido al sistema de gestión veterinaria."
    }
  }

  return (
    <AuthWrapper>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{getWelcomeMessage()}</h1>
              <p className="text-muted-foreground">{getRoleDescription()}</p>
            </div>
            <Button className="gap-2" asChild>
              <Link href="/appointments">
                <Plus className="h-4 w-4" />
                Nuevo nombramiento
              </Link>
            </Button>
          </div>

          {/* Role-specific Panel */}
          <DashboardRolePanel user={user} />

          {/* Stats Cards - Now with real data! */}
          <DashboardStats />

          {/* Charts - Revenue and Appointments */}
          <div className="grid gap-6 md:grid-cols-2">
            <DashboardRevenueTrend />
            <DashboardAppointmentChart />
          </div>

          {/* Quick Actions and Recent Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            <DashboardQuickActions user={user} />
            <DashboardRecentActivity />
          </div>
        </div>
      </DashboardLayout>
    </AuthWrapper>
  )
}