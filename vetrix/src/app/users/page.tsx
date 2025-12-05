"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { RegisterForm } from "../../../components/auth/register-form"
import { useToast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
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
import { UserDTO } from "@/lib/api/types/user.types"
import { useUsers } from "@/src/hooks/useUsers"
import { UserStats } from "@/src/components/users/UserStats"
import { UserFilters } from "@/src/components/users/UserFilters"
import { UsersTable } from "@/src/components/users/UsersTable"

export default function UsersPage() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [deleteUser, setDeleteUser] = useState<UserDTO | null>(null)
  const [roleFilter, setRoleFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Fetch users from API
  const { users = [], isLoading, deleteUser: deleteUserMutation } = useUsers()

  const handleDeleteUser = async (user: UserDTO) => {
    // Prevent deleting the last admin
    if (user.roleId === 1 && users.filter((u) => u.roleId === 1).length === 1) {
      toast({
        title: "No se puede eliminar",
        description: "No se puede eliminar la última cuenta de administrador.",
        variant: "destructive",
      })
      setDeleteUser(null)
      return
    }

    deleteUserMutation.mutate(user.id)
    setDeleteUser(null)
  }

  // Client-side filtering
  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === "all" || String(user.roleId) === roleFilter
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)

    return matchesRole && matchesSearch
  })

  if (isLoading) {
    return (
      <AuthWrapper>
        <ProtectedRoute requiredPermission="manage_users">
          <DashboardLayout>
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading users...</div>
            </div>
          </DashboardLayout>
        </ProtectedRoute>
      </AuthWrapper>
    )
  }

  return (
    <AuthWrapper>
      <ProtectedRoute requiredPermission="manage_users">
        <DashboardLayout>
          <div className="space-y-6">
            {/* Header */}
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

            {/* Statistics */}
            <UserStats users={users} />

            {/* Filters */}
            <UserFilters
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            {/* Users List */}
            <UsersTable
              users={filteredUsers}
              onDelete={(user) => setDeleteUser(user)}
            />

            {/* Register Form Dialog */}
            <RegisterForm open={isRegisterOpen} onOpenChange={setIsRegisterOpen} />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Está seguro de que desea eliminar el usuario "{deleteUser?.username}" ({deleteUser?.email})?
                    Esta acción no se puede deshacer.
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
