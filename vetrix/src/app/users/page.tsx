"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Shield, UserCheck, MoreHorizontal, Trash2, Edit, UserCog } from "lucide-react"
import { RegisterForm } from "@/components/register-form"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { AuthWrapper } from "@/components/auth-wrapper"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface User {
  id: number
  username: string
  email: string
  role: "admin" | "vet" | "assistant"
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const { toast } = useToast()

  // Mock users data for immediate display
  const mockUsers: User[] = [
    {
      id: 1,
      username: "admin",
      email: "admin@vetclinic.com",
      role: "admin",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      username: "dr.smith",
      email: "dr.smith@vetclinic.com",
      role: "vet",
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      username: "assistant1",
      email: "assistant@vetclinic.com",
      role: "assistant",
      created_at: new Date().toISOString(),
    },
  ]

  useEffect(() => {
    // Use mock data for immediate display
    setUsers(mockUsers)
    setIsLoading(false)
  }, [])

  const handleDeleteUser = async (user: User) => {
    if (user.role === "admin" && users.filter((u) => u.role === "admin").length === 1) {
      toast({
        title: "No se puede eliminar",
        description: "No se puede eliminar la última cuenta de administrador.",
        variant: "destructive",
      })
      return
    }

    setUsers(users.filter((u) => u.id !== user.id))
    toast({
      title: "Éxito",
      description: `El usuario ${user.username} ha sido eliminado`,
    })
    setDeleteUser(null)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "vet":
        return <UserCheck className="h-4 w-4" />
      case "assistant":
        return <Users className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "vet":
        return "default"
      case "assistant":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "admin":
        return "Acceso completo al sistema y administración de usuarios"
      case "vet":
        return "Administra mascotas, citas y registros médicos."
      case "assistant":
        return "Ingreso de datos básicos y programación de citas"
      default:
        return "Acceso de usuario estándar"
    }
  }

  // Calculate user statistics
  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    vets: users.filter((u) => u.role === "vet").length,
    assistants: users.filter((u) => u.role === "assistant").length,
  }

  return (
    <AuthWrapper>
      <ProtectedRoute requiredPermission="manage_users">
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Administración de usuarios</h1>
                <p className="text-gray-600">Administrar los usuarios del sistema y sus roles</p>
              </div>
              <Button onClick={() => setIsRegisterOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Añadir usuario
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de usuarios</CardTitle>
                  <UserCog className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Usuarios activos del sistema</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                  <Shield className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
                  <p className="text-xs text-muted-foreground">Usuarios con acceso completo</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Veterinarios</CardTitle>
                  <UserCheck className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.vets}</div>
                  <p className="text-xs text-muted-foreground">Profesionales médicos</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Asistentes</CardTitle>
                  <Users className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.assistants}</div>
                  <p className="text-xs text-muted-foreground">Personal de apoyo</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">{getRoleIcon(user.role)}</div>
                        <div>
                          <CardTitle className="text-lg">{user.username}</CardTitle>
                          <CardDescription>{user.email}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getRoleBadgeVariant(user.role) as any} className="capitalize">
                          {user.role}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar usuario
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() => setDeleteUser(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar usuario
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{getRoleDescription(user.role)}</p>
                      <p className="text-xs text-gray-500">Creado: {new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <RegisterForm open={isRegisterOpen} onOpenChange={setIsRegisterOpen} />

            <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Está seguro de que desea eliminar el usuario? "{deleteUser?.username}"? Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteUser && handleDeleteUser(deleteUser)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Eliminar usuario
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    </AuthWrapper>
  )
}
