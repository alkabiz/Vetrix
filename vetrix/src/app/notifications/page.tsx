"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, AlertTriangle, CheckCircle2, Info, Clock } from "lucide-react"
import { cn } from "@/lib/core/utils"

// Mock notifications — in production, these would come from an API/database
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "appointment" as const,
    title: "Cita próxima",
    message: "Recordatorio: Cita con Max (Labrador) mañana a las 10:00 AM",
    time: "Hace 5 min",
    read: false,
  },
  {
    id: 2,
    type: "alert" as const,
    title: "Vacuna pendiente",
    message: "Luna (Gato Persa) tiene una vacuna de refuerzo pendiente",
    time: "Hace 1 hora",
    read: false,
  },
  {
    id: 3,
    type: "system" as const,
    title: "Actualización del sistema",
    message: "Vetrix Pro se ha actualizado a la versión 1.1. Revisa las novedades.",
    time: "Hace 3 horas",
    read: true,
  },
  {
    id: 4,
    type: "success" as const,
    title: "Factura pagada",
    message: "La factura #1042 de Carlos Rodríguez ha sido marcada como pagada",
    time: "Hace 5 horas",
    read: true,
  },
  {
    id: 5,
    type: "appointment" as const,
    title: "Cita cancelada",
    message: "La cita de Toby (Bulldog) del viernes ha sido cancelada por el propietario",
    time: "Ayer",
    read: true,
  },
  {
    id: 6,
    type: "info" as const,
    title: "Nuevo propietario registrado",
    message: "María López se ha registrado como nueva propietaria en el sistema",
    time: "Ayer",
    read: true,
  },
]

const NOTIFICATION_ICONS: Record<string, typeof Bell> = {
  appointment: Calendar,
  alert: AlertTriangle,
  system: Info,
  success: CheckCircle2,
  info: Bell,
}

const NOTIFICATION_COLORS: Record<string, string> = {
  appointment: "text-blue-500 bg-blue-50",
  alert: "text-amber-500 bg-amber-50",
  system: "text-purple-500 bg-purple-50",
  success: "text-green-500 bg-green-50",
  info: "text-gray-500 bg-gray-50",
}

export default function NotificationsPage() {
  const { user } = useAuth()

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length

  return (
    <AuthWrapper>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Notificaciones</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0
                  ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? "es" : ""} sin leer`
                  : "No tienes notificaciones nuevas"}
              </p>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Bell className="h-3.5 w-3.5 mr-1.5" />
              {unreadCount} nueva{unreadCount !== 1 ? "s" : ""}
            </Badge>
          </div>

          {/* Notification list */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Todas las notificaciones</CardTitle>
              <CardDescription>Actividad reciente y alertas del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 p-0">
              {MOCK_NOTIFICATIONS.map((notification) => {
                const Icon = NOTIFICATION_ICONS[notification.type] || Bell
                const colorClass = NOTIFICATION_COLORS[notification.type] || NOTIFICATION_COLORS.info

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 px-6 py-4 border-b last:border-b-0 transition-colors cursor-pointer hover:bg-muted/50",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    <div className={cn("flex items-center justify-center h-10 w-10 rounded-full shrink-0", colorClass)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthWrapper>
  )
}
