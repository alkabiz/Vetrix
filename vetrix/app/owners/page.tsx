"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DataTable } from "@/components/data-table"
import { OwnerForm } from "@/components/owner-form"
import { useToast } from "@/hooks/use-toast"
import type { Owner } from "@/lib/database"
import { AuthWrapper } from "@/components/auth-wrapper"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"

const mockOwners: Owner[] = [
  {
    id: 1,
    name: "John Smith",
    phone: "(555) 123-4567",
    email: "john.smith@email.com",
    address: "123 Main St, Anytown, ST 12345",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    phone: "(555) 987-6543",
    email: "sarah.j@email.com",
    address: "456 Oak Ave, Somewhere, ST 67890",
    created_at: "2024-01-20T14:15:00Z",
    updated_at: "2024-01-20T14:15:00Z",
  },
  {
    id: 3,
    name: "Mike Wilson",
    phone: "(555) 456-7890",
    email: "mike.wilson@email.com",
    address: "789 Pine Rd, Elsewhere, ST 54321",
    created_at: "2024-02-01T09:45:00Z",
    updated_at: "2024-02-01T09:45:00Z",
  },
]

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>(mockOwners)
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const canDelete = user?.role === "admin" || user?.role === "vet"
  const canEdit = user?.role === "admin" || user?.role === "vet" || user?.role === "assistant"
  const canAdd = user?.role === "admin" || user?.role === "vet" || user?.role === "assistant"

  const handleAddOwner = () => {
    if (!canAdd) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to add owners",
        variant: "destructive",
      })
      return
    }
    setSelectedOwner(null)
    setIsFormOpen(true)
  }

  const handleEditOwner = (owner: Owner) => {
    if (!canEdit) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit owners",
        variant: "destructive",
      })
      return
    }
    setSelectedOwner(owner)
    setIsFormOpen(true)
  }

  const handleDeleteOwner = async (owner: Owner) => {
    if (!canDelete) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete owners",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`Are you sure you want to delete ${owner.name}? This will also delete all associated pets.`)) {
      return
    }

    setOwners(owners.filter((o) => o.id !== owner.id))
    toast({
      title: "Success",
      description: "Owner deleted successfully",
    })
  }

  const handleSubmitOwner = async (ownerData: Omit<Owner, "id" | "created_at" | "updated_at">) => {
    if (selectedOwner) {
      const updatedOwner = {
        ...selectedOwner,
        ...ownerData,
        updated_at: new Date().toISOString(),
      }
      setOwners(owners.map((o) => (o.id === selectedOwner.id ? updatedOwner : o)))
      toast({
        title: "Success",
        description: "Owner updated successfully",
      })
    } else {
      const newOwner: Owner = {
        id: Math.max(...owners.map((o) => o.id)) + 1,
        ...ownerData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setOwners([...owners, newOwner])
      toast({
        title: "Success",
        description: "Owner created successfully",
      })
    }
    setIsFormOpen(false)
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    {
      key: "created_at",
      label: "Created",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ]

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
              <p className="text-muted-foreground">Manage pet owners and their contact information</p>
              {user?.role === "assistant" && (
                <p className="text-sm text-orange-600 mt-1">
                  Assistant access: You can create and edit owners, but cannot delete them.
                </p>
              )}
            </div>

            <DataTable
              title="Pet Owners"
              description="All registered pet owners in the system"
              data={owners}
              columns={columns}
              onAdd={canAdd ? handleAddOwner : undefined}
              onEdit={canEdit ? handleEditOwner : undefined}
              onDelete={canDelete ? handleDeleteOwner : undefined}
              searchPlaceholder="Search owners..."
              addButtonText="Add Owner"
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
