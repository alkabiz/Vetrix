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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { UserDTO, UserUpdateInput } from "@/lib/api/types/user.types"
import { useUsers } from "@/src/hooks/useUsers"
import { UserStats } from "@/src/components/users/UserStats"
import { UserFilters } from "@/src/components/users/UserFilters"
import { UsersTable } from "@/src/components/users/UsersTable"
import { EditUserForm } from "@/src/components/users/EditUserForm"
import { PaginationControls } from "@/src/components/users/PaginationControls"
import { BulkActionsBar } from "@/src/components/users/BulkActionsBar"

export default function UsersPage() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [deleteUser, setDeleteUser] = useState<UserDTO | null>(null)
  const [editUser, setEditUser] = useState<UserDTO | null>(null)
  const [roleFilter, setRoleFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // Bulk actions state
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
  const [showBulkRoleDialog, setShowBulkRoleDialog] = useState(false)
  const [bulkRoleId, setBulkRoleId] = useState("")

  const { toast } = useToast()

  // Fetch users with pagination and filtering
  const {
    users = [],
    pagination,
    isLoading,
    deleteUser: deleteUserMutation,
    updateUser: updateUserMutation,
    bulkDelete: bulkDeleteMutation,
    bulkRoleChange: bulkRoleChangeMutation,
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
    setSelectedUsers([]) // Clear selection on page change
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(1)
    setSelectedUsers([]) // Clear selection on page size change
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
    setSelectedUsers([]) // Clear selection on search
  }

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role)
    setCurrentPage(1)
    setSelectedUsers([]) // Clear selection on filter change
  }

  const handleSelectUser = (userId: number, selected: boolean) => {
    setSelectedUsers((prev) => (selected ? [...prev, userId] : prev.filter((id) => id !== userId)))
  }

  const handleClearSelection = () => {
    setSelectedUsers([])
  }

  const handleBulkDelete = () => {
    setShowBulkDeleteDialog(true)
  }

  const confirmBulkDelete = () => {
    // Check if trying to delete all admins
    const selectedUserObjects = users.filter((u) => selectedUsers.includes(u.id))
    const adminsToDelete = selectedUserObjects.filter((u) => u.roleId === 1)
    const totalAdmins = users.filter((u) => u.roleId === 1).length

    if (adminsToDelete.length > 0 && adminsToDelete.length >= totalAdmins) {
      toast({
        title: "Cannot delete all admins",
        description: "You cannot delete all administrator users.",
        variant: "destructive",
      })
      setShowBulkDeleteDialog(false)
      return
    }

    bulkDeleteMutation.mutate(selectedUsers)
    setSelectedUsers([])
    setShowBulkDeleteDialog(false)
  }

  const handleBulkRoleChange = () => {
    setBulkRoleId("")
    setShowBulkRoleDialog(true)
  }

  const confirmBulkRoleChange = () => {
    if (!bulkRoleId) {
      toast({
        title: "Select a role",
        description: "Please select a role before continuing.",
        variant: "destructive",
      })
      return
    }

    const newRoleId = parseInt(bulkRoleId)

    // Check if changing admins to non-admin would leave no admins
    if (newRoleId !== 1) {
      const selectedUserObjects = users.filter((u) => selectedUsers.includes(u.id))
      const adminsToChange = selectedUserObjects.filter((u) => u.roleId === 1)
      const totalAdmins = users.filter((u) => u.roleId === 1).length

      if (adminsToChange.length > 0 && adminsToChange.length >= totalAdmins) {
        toast({
          title: "Cannot change all admins",
          description: "You cannot change all administrator users to a different role.",
          variant: "destructive",
        })
        setShowBulkRoleDialog(false)
        return
      }
    }

    bulkRoleChangeMutation.mutate({ userIds: selectedUsers, roleId: newRoleId })
    setSelectedUsers([])
    setShowBulkRoleDialog(false)
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

            {/* Statistics */}
            <UserStats users={users} />

            {/* Filters */}
            <UserFilters
              roleFilter={roleFilter}
              onRoleFilterChange={handleRoleFilterChange}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />

            {/* Users List */}
            <UsersTable
              users={users}
              onEdit={(user) => setEditUser(user)}
              onDelete={(user) => setDeleteUser(user)}
              selectedUsers={selectedUsers}
              onSelectUser={handleSelectUser}
            />

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

            {/* Bulk Actions Bar */}
            <BulkActionsBar
              selectedCount={selectedUsers.length}
              onClearSelection={handleClearSelection}
              onBulkDelete={handleBulkDelete}
              onBulkRoleChange={handleBulkRoleChange}
            />

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

            {/* Delete Single User Confirmation */}
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

            {/* Bulk Delete Confirmation */}
            <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar usuarios seleccionados</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Está seguro de que desea eliminar {selectedUsers.length} usuario(s) seleccionado(s)? Esta acción no
                    se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmBulkDelete} className="bg-red-600 hover:bg-red-700">
                    Eliminar {selectedUsers.length} usuario(s)
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Bulk Role Change Dialog */}
            <Dialog open={showBulkRoleDialog} onOpenChange={setShowBulkRoleDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cambiar rol de usuarios seleccionados</DialogTitle>
                  <DialogDescription>
                    Seleccione el nuevo rol para {selectedUsers.length} usuario(s) seleccionado(s).
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="bulk-role">Nuevo rol</Label>
                  <Select value={bulkRoleId} onValueChange={setBulkRoleId}>
                    <SelectTrigger id="bulk-role" className="mt-2">
                      <SelectValue placeholder="Seleccione un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Admin</SelectItem>
                      <SelectItem value="2">Veterinarian</SelectItem>
                      <SelectItem value="3">Assistant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowBulkRoleDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={confirmBulkRoleChange}>Cambiar rol</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    </AuthWrapper>
  )
}
