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
import { AdminMetrics } from "@/src/components/dashboard/AdminMetrics"
import { VetSchedule } from "@/src/components/dashboard/VetSchedule"
import { AssistantTasks } from "@/src/components/dashboard/AssistantTasks"

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
        return "Panel de administración del sistema"
      case 2:
        return "Panel clínico veterinario"
      case 3:
        return "Panel de asistente administrativo"
      default:
        return "Bienvenido al sistema de gestión veterinaria."
    }
  }

  // Role-based dashboard layouts
  const renderAdminDashboard = () => (
    <>
      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <DashboardRevenueTrend />
        </div>
        <AdminMetrics />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DashboardAppointmentChart />
        <DashboardRecentActivity />
      </div>

      <DashboardQuickActions user={user} />
    </>
  )

  const renderVetDashboard = () => (
    <>
      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2">
        <VetSchedule />
        <DashboardAppointmentChart />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DashboardQuickActions user={user} />
        <DashboardRecentActivity />
      </div>
    </>
  )

  const renderAssistantDashboard = () => (
    <>
      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <DashboardRevenueTrend />
        </div>
        <AssistantTasks />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DashboardQuickActions user={user} />
        <DashboardRecentActivity />
      </div>
    </>
  )

  const renderDashboardContent = () => {
    if (!user) return <DashboardStats />

    switch (user.roleId) {
      case 1: // Admin
        return renderAdminDashboard()
      case 2: // Vet
        return renderVetDashboard()
      case 3: // Assistant
        return renderAssistantDashboard()
      default:
        return <DashboardStats />
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

          {/* Role-Based Dashboard Content */}
          {renderDashboardContent()}
        </div>
      </DashboardLayout>
    </AuthWrapper>
  )
}