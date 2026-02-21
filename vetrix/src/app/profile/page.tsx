"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/core/utils"
import { getUserInitials, getRoleBadgeColor } from "@/components/layout/utils/role-utils"
import { User, Mail, Shield, Calendar, Clock, Globe, Bell } from "lucide-react"

export default function ProfilePage() {
  const { user, permissions } = useAuth()

  if (!user) return null

  const roleLabel = user.role || (user.roleId === 1 ? "admin" : user.roleId === 2 ? "vet" : "assistant")

  const profileFields = [
    { icon: User, label: "Nombre de usuario", value: user.username },
    { icon: Mail, label: "Correo electrónico", value: user.email },
    { icon: Shield, label: "Rol", value: roleLabel, isBadge: true },
    { icon: Calendar, label: "ID de usuario", value: `#${user.id}` },
  ]

  return (
    <AuthWrapper>
      <DashboardLayout>
        <div className="space-y-6 max-w-3xl">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
            <p className="text-muted-foreground">Información de tu cuenta</p>
          </div>

          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                    {getUserInitials(user.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{user.username}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <Badge className={cn("mt-1 text-xs capitalize", getRoleBadgeColor(roleLabel))}>
                    {roleLabel}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalles de la cuenta</CardTitle>
              <CardDescription>Tu información personal y de acceso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileFields.map((field, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-muted">
                      <field.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        {field.label}
                      </p>
                      {field.isBadge ? (
                        <Badge className={cn("mt-0.5 text-xs capitalize", getRoleBadgeColor(field.value))}>
                          {field.value}
                        </Badge>
                      ) : (
                        <p className="text-sm font-medium">{field.value}</p>
                      )}
                    </div>
                  </div>
                  {index < profileFields.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Permissions Card */}
          {permissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Permisos asignados
                </CardTitle>
                <CardDescription>
                  Permisos otorgados por tu rol ({roleLabel})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {permissions.map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </AuthWrapper>
  )
}
