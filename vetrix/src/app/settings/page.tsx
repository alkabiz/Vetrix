"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Bell, Globe, Lock, Clock, Mail, Shield, Smartphone, Sun, Moon, Monitor, Laptop } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  // Local state for settings (would come from API in production)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [appointmentReminders, setAppointmentReminders] = useState(true)
  const [systemAlerts, setSystemAlerts] = useState(true)
  const [language, setLanguage] = useState("es")
  const [timezone, setTimezone] = useState("America/Bogota")
  const [sessionTimeout, setSessionTimeout] = useState("30")

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Display preferences state
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [density, setDensity] = useState("comfortable")

  // Default reminders state (assistant only)
  const [reminderTime, setReminderTime] = useState("60")
  const [reminderChannels, setReminderChannels] = useState<string[]>(["email"])
  const [reminderNote, setReminderNote] = useState("")

  // Mock active sessions data (admin only)
  const sessions = [
    { id: 1, device: "Chrome en Windows", location: "Bogotá, Colombia", lastActive: "Activo hace 2 minutos", icon: "desktop" as const },
    { id: 2, device: "Safari en iPhone", location: "Medellín, Colombia", lastActive: "Activo hace 1 hora", icon: "mobile" as const },
    { id: 3, device: "Firefox en macOS", location: "Cali, Colombia", lastActive: "Activo hace 3 horas", icon: "desktop" as const },
  ]

  const isAdmin = user?.roleId === 1
  const isAssistant = user?.roleId === 3

  const handleSaveDisplayPreferences = () => {
    toast({
      title: "Preferencias guardadas",
      description: "Tus preferencias de visualización se han actualizado.",
    })
  }

  const handleCloseSession = (sessionId: number) => {
    toast({
      title: "Sesión cerrada",
      description: "La sesión ha sido cerrada correctamente.",
    })
  }

  const handleCloseAllSessions = () => {
    toast({
      title: "Sesiones cerradas",
      description: "Todas las otras sesiones han sido cerradas.",
    })
  }

  const handleSaveReminders = () => {
    toast({
      title: "Recordatorios guardados",
      description: "La configuración de recordatorios se ha actualizado.",
    })
  }

  const toggleChannel = (channel: string) => {
    setReminderChannels(prev =>
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    )
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Configuración guardada",
      description: "Las preferencias de notificación se han actualizado correctamente.",
    })
  }

  const handleSavePreferences = () => {
    toast({
      title: "Preferencias guardadas",
      description: "Tus preferencias regionales se han actualizado correctamente.",
    })
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, completa todos los campos de contraseña.",
      })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Las contraseñas nuevas no coinciden.",
      })
      return
    }
    if (newPassword.length < 12) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La contraseña debe tener al menos 12 caracteres.",
      })
      return
    }

    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido cambiada exitosamente.",
    })
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  if (!user) return null

  return (
    <AuthWrapper>
      <DashboardLayout>
        <div className="space-y-6 w-full">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ajustes</h1>
            <p className="text-muted-foreground">Administra las configuraciones de tu cuenta</p>
          </div>

          {/* Notifications, Regional Preferences & Password — side by side on md+ */}
          <div className="flex flex-col md:flex-row gap-6 w-full items-start">
            {/* Notification Settings */}
            <Card className="w-full md:flex-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificaciones
                </CardTitle>
                <CardDescription>Configura cómo recibes las notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="email-notifications" className="font-medium">
                        Notificaciones por correo
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      Recibe resúmenes y alertas en tu email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="sms-notifications" className="font-medium">
                        Notificaciones SMS
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      Recibe alertas urgentes por SMS
                    </p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="appointment-reminders" className="font-medium">
                        Recordatorios de citas
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      Notificaciones antes de cada cita programada
                    </p>
                  </div>
                  <Switch
                    id="appointment-reminders"
                    checked={appointmentReminders}
                    onCheckedChange={setAppointmentReminders}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="system-alerts" className="font-medium">
                        Alertas del sistema
                      </Label>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      Actualizaciones y alertas importantes del sistema
                    </p>
                  </div>
                  <Switch
                    id="system-alerts"
                    checked={systemAlerts}
                    onCheckedChange={setSystemAlerts}
                  />
                </div>

                <Button onClick={handleSaveNotifications} className="mt-2">
                  Guardar notificaciones
                </Button>
              </CardContent>
            </Card>

            {/* Regional Preferences */}
            <Card className="w-full md:flex-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Preferencias regionales
                </CardTitle>
                <CardDescription>Idioma, zona horaria y tiempo de sesión</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="timezone">Zona horaria</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Bogota">América/Bogotá (UTC-5)</SelectItem>
                      <SelectItem value="America/Mexico_City">América/Ciudad de México (UTC-6)</SelectItem>
                      <SelectItem value="America/Buenos_Aires">América/Buenos Aires (UTC-3)</SelectItem>
                      <SelectItem value="America/Lima">América/Lima (UTC-5)</SelectItem>
                      <SelectItem value="Europe/Madrid">Europa/Madrid (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="session-timeout">Tiempo de expiración de sesión (minutos)</Label>
                  <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                    <SelectTrigger id="session-timeout" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSavePreferences}>
                  Guardar preferencias
                </Button>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="w-full md:flex-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Cambiar contraseña
                </CardTitle>
                <CardDescription>Actualiza tu contraseña de acceso al sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Contraseña actual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña actual"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 12 caracteres"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la nueva contraseña"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  La contraseña debe tener al menos 12 caracteres, incluyendo mayúsculas, minúsculas,
                  números y caracteres especiales.
                </p>
                <Button onClick={handleChangePassword} variant="destructive">
                  Cambiar contraseña
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Second row: Display Preferences + role-gated cards */}
          <div className="flex flex-col md:flex-row gap-6 w-full items-start">

            {/* Card 1 — Display Preferences (all roles) */}
            <Card className="w-full md:flex-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  Preferencias de visualización
                </CardTitle>
                <CardDescription>Personaliza el aspecto de la interfaz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      {theme === "light" ? <Sun className="h-4 w-4 text-muted-foreground" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
                      <Label htmlFor="theme-toggle" className="font-medium">Tema</Label>
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      {theme === "light" ? "Modo claro activo" : "Modo oscuro activo"}
                    </p>
                  </div>
                  <Switch
                    id="theme-toggle"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
                <Separator />
                {/* Density selector */}
                <div className="grid gap-2">
                  <Label htmlFor="density">Densidad de la interfaz</Label>
                  <Select value={density} onValueChange={setDensity}>
                    <SelectTrigger id="density" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comfortable">Cómoda</SelectItem>
                      <SelectItem value="compact">Compacta</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {density === "comfortable"
                      ? "Mayor espaciado entre elementos"
                      : "Diseño más denso para usuarios avanzados"}
                  </p>
                </div>
                <Button onClick={handleSaveDisplayPreferences}>Guardar preferencias</Button>
              </CardContent>
            </Card>

            {/* Card 2 — Active Sessions (admin only) */}
            {isAdmin && (
              <Card className="w-full md:flex-1">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Sesiones activas
                  </CardTitle>
                  <CardDescription>Gestiona los dispositivos donde tu cuenta está iniciada</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sessions.map((session, index) => (
                    <div key={session.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-muted-foreground">
                            {session.icon === "desktop" ? (
                              <Laptop className="h-5 w-5" />
                            ) : (
                              <Smartphone className="h-5 w-5" />
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">{session.device}</p>
                            <p className="text-xs text-muted-foreground">{session.location}</p>
                            <p className="text-xs text-muted-foreground">{session.lastActive}</p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCloseSession(session.id)}
                          className="shrink-0"
                        >
                          Cerrar
                        </Button>
                      </div>
                      {index < sessions.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full mt-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={handleCloseAllSessions}
                  >
                    Cerrar todas las otras sesiones
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Card 3 — Default Reminders (assistant only) */}
            {isAssistant && (
              <Card className="w-full md:flex-1">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recordatorios predeterminados
                  </CardTitle>
                  <CardDescription>Define con cuánta anticipación se envían los recordatorios a los clientes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Reminder time */}
                  <div className="grid gap-2">
                    <Label htmlFor="reminder-time">Tiempo antes de la cita</Label>
                    <Select value={reminderTime} onValueChange={setReminderTime}>
                      <SelectTrigger id="reminder-time" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="120">2 horas</SelectItem>
                        <SelectItem value="360">6 horas</SelectItem>
                        <SelectItem value="720">12 horas</SelectItem>
                        <SelectItem value="1440">24 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Reminder channels */}
                  <div className="space-y-2">
                    <Label>Canal de recordatorio</Label>
                    <div className="space-y-2">
                      {(["email", "sms", "both"] as const).map((channel) => (
                        <div key={channel} className="flex items-center gap-2">
                          <Checkbox
                            id={`channel-${channel}`}
                            checked={reminderChannels.includes(channel)}
                            onCheckedChange={() => toggleChannel(channel)}
                          />
                          <Label htmlFor={`channel-${channel}`} className="font-normal cursor-pointer">
                            {channel === "email" ? "Correo electrónico" : channel === "sms" ? "SMS" : "Ambos"}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Additional note */}
                  <div className="grid gap-2">
                    <Label htmlFor="reminder-note">Nota adicional (opcional)</Label>
                    <Textarea
                      id="reminder-note"
                      placeholder="Mensaje personalizado a incluir en el recordatorio (opcional)"
                      value={reminderNote}
                      onChange={(e) => setReminderNote(e.target.value.slice(0, 120))}
                      rows={3}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground text-right">{reminderNote.length}/120</p>
                  </div>
                  <Button onClick={handleSaveReminders}>Guardar recordatorios</Button>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </DashboardLayout>
    </AuthWrapper>
  )
}
