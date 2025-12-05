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
import { UserDTO, UserUpdateInput } from "@/lib/api/types/user.types"
import { useUsers } from "@/src/hooks/useUsers"
import { UserStats } from "@/src/components/users/UserStats"
import { UserFilters } from "@/src/components/users/UserFilters"
import { UsersTable } from "@/src/components/users/UsersTable"
import { EditUserForm } from "@/src/components/users/EditUserForm"
import { PaginationControls } from "@/src/components/users/PaginationControls"

export default function UsersPage() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [deleteUser, setDeleteUser] = useState<UserDTO | null>(null)
  const [editUser, setEditUser] = useState<UserDTO | null>(null)
  const [roleFilter, setRoleFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { toast } = useToast()

  // Fetch users with pagination and filtering
  const {
    users = [],
    pagination,
    isLoading,
    deleteUser: deleteUserMutation,
    updateUser: updateUserMutation,
  } = useUsers({
    enablePagination: true,
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
    roleId: roleFilter !== "all" ? parseInt(roleFilter) : undefined,
  })

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

  const handleEditUser = async (userId: number, data: UserUpdateInput) => {
    // Check if trying to remove last admin
    const userToEdit = users.find((u) => u.id === userId)
    if (userToEdit && userToEdit.roleId === 1 && data.roleId !== 1) {
      const adminCount = users.filter((u) => u.roleId === 1).length
      if (adminCount <= 1) {
        toast({
          title: "No se puede cambiar el rol",
          description: "No se puede cambiar el rol de la última cuenta de administrador.",
          variant: "destructive",
        })
        throw new Error("Cannot change role of last admin")
      }
    }

    await updateUserMutation.mutateAsync({ id: userId, data })
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role)
    setCurrentPage(1) // Reset to first page when filtering
  }

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

            {/* Statistics - Note: Stats now show current page users only */}
            <UserStats users={users} />

            {/* Filters */}
            <UserFilters
              roleFilter={roleFilter}
              onRoleFilterChange={handleRoleFilterChange}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />

            {/* Users List */}
            <UsersTable users={users} onEdit={(user) => setEditUser(user)} onDelete={(user) => setDeleteUser(user)} />

            {/* Pagination Controls */}
            {pagination && (
              <PaginationControls
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                pageSize={pagination.itemsPerPage}
                totalItems={pagination.totalItems}
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPreviousPage}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}

            {/* Register Form Dialog */}
            <RegisterForm open={isRegisterOpen} onOpenChange={setIsRegisterOpen} />

            {/* Edit User Form Dialog */}
            <EditUserForm
              open={!!editUser}
              onOpenChange={(open) => !open && setEditUser(null)}
              user={editUser}
              onSubmit={handleEditUser}
              isSubmitting={updateUserMutation.isPending}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar usuario</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Está seguro de que desea eliminar el usuario "{deleteUser?.username}" ({deleteUser?.email})? Esta
                    acción no se puede deshacer.
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
