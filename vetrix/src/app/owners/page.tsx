"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { OwnerForm } from "@/components/forms/owner"
import { useToast } from "@/hooks/use-toast"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { useOwners } from "@/src/hooks/useOwners"
import { OwnersTable } from "@/components/owners/OwnersTable"
import { OwnerStats } from "@/components/owners/OwnerStats"
import { OwnerFilters } from "@/components/owners/OwnerFilters"
import { OwnerDTO, OwnerInput } from "@/lib/api/types/owner.types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function OwnersPage() {
  const { owners = [], isLoading, createOwner, updateOwner, deleteOwner } = useOwners()
  const [selectedOwner, setSelectedOwner] = useState<OwnerDTO | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const { user } = useAuth()

  const canDelete = user?.role === "admin" || user?.role === "vet"
  const canEdit = user?.role === "admin" || user?.role === "vet" || user?.role === "assistant"
  const canAdd = user?.role === "admin" || user?.role === "vet" || user?.role === "assistant"

  const handleAddOwner = () => {
    if (!canAdd) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to add owners.",
        variant: "destructive",
      })
      return
    }
    setSelectedOwner(null)
    setIsFormOpen(true)
  }

  const handleEditOwner = (owner: OwnerDTO) => {
    if (!canEdit) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to edit owners.",
        variant: "destructive",
      })
      return
    }
    setSelectedOwner(owner)
    setIsFormOpen(true)
  }

  const handleDeleteOwner = async (owner: OwnerDTO) => {
    if (!canDelete) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to delete owners.",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`Are you sure you want to delete ${owner.name || owner.firstName}? This will also delete all associated pets.`)) {
      return
    }

    deleteOwner.mutate(owner.id)
  }

  const handleSubmitOwner = async (ownerData: OwnerInput) => {
    try {
      if (selectedOwner) {
        await updateOwner.mutateAsync({ id: selectedOwner.id, data: ownerData })
      } else {
        await createOwner.mutateAsync(ownerData)
      }
      setIsFormOpen(false)
    } catch (error) {
      // Error handling is done in the mutation callbacks
      console.error(error)
    }
  }

  // Client-side filtering
  const filteredOwners = owners.filter((owner) => {
    const searchLower = searchTerm.toLowerCase()
    const name = `${owner.firstName} ${owner.lastName}`.toLowerCase()
    const email = (owner.email || "").toLowerCase()
    const phone = (owner.phonePrimary || "").toLowerCase()

    return name.includes(searchLower) || email.includes(searchLower) || phone.includes(searchLower)
  })

  if (isLoading) {
    return (
      <AuthWrapper>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading owners...</div>
          </div>
        </DashboardLayout>
      </AuthWrapper>
    )
  }

  return (
    <AuthWrapper>
      <ProtectedRoute requiredPermission="view_all">
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Owners</h1>
              <p className="text-muted-foreground">Manage pet owners and their contact information.</p>
              {user?.role === "assistant" && (
                <p className="text-sm text-orange-600 mt-1">
                  Assistant Access: Can create and edit owners, but cannot delete them.
                </p>
              )}
            </div>

            <OwnerStats owners={owners} />

            <div className="flex items-center justify-between">
              <OwnerFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              {canAdd && (
                <Button onClick={handleAddOwner}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Owner
                </Button>
              )}
            </div>

            <OwnersTable
              owners={filteredOwners}
              onEdit={canEdit ? handleEditOwner : undefined}
              onDelete={canDelete ? handleDeleteOwner : undefined}
            />

            <OwnerForm
              owner={selectedOwner}
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              onSubmit={handleSubmitOwner}
            />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    </AuthWrapper>
  )
}
