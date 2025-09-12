"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DataTable } from "@/components/data-table"
import { PetForm } from "@/components/pet-form"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { Pet, Owner } from "@/lib/database"
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

const mockPets: Pet[] = [
  {
    id: 1,
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    sex: "Male",
    age: 5,
    weight: 65,
    owner_id: 1,
    owner_name: "John Smith",
    created_at: "2024-01-15T11:00:00Z",
    updated_at: "2024-01-15T11:00:00Z",
  },
  {
    id: 2,
    name: "Luna",
    species: "Cat",
    breed: "Siamese",
    sex: "Female",
    age: 3,
    weight: 8,
    owner_id: 2,
    owner_name: "Sarah Johnson",
    created_at: "2024-01-20T15:30:00Z",
    updated_at: "2024-01-20T15:30:00Z",
  },
  {
    id: 3,
    name: "Max",
    species: "Dog",
    breed: "German Shepherd",
    sex: "Male",
    age: 7,
    weight: 75,
    owner_id: 3,
    owner_name: "Mike Wilson",
    created_at: "2024-02-01T10:15:00Z",
    updated_at: "2024-02-01T10:15:00Z",
  },
  {
    id: 4,
    name: "Whiskers",
    species: "Cat",
    breed: "Persian",
    sex: "Female",
    age: 2,
    weight: 10,
    owner_id: 1,
    owner_name: "John Smith",
    created_at: "2024-02-05T14:20:00Z",
    updated_at: "2024-02-05T14:20:00Z",
  },
]

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>(mockPets)
  const [owners, setOwners] = useState<Owner[]>(mockOwners)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const canDelete = user?.role === "admin" || user?.role === "vet"
  const canEdit = user?.role === "admin" || user?.role === "vet" || user?.role === "assistant"
  const canAdd = user?.role === "admin" || user?.role === "vet" || user?.role === "assistant"

  const handleAddPet = () => {
    if (!canAdd) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to add pets",
        variant: "destructive",
      })
      return
    }
    setSelectedPet(null)
    setIsFormOpen(true)
  }

  const handleEditPet = (pet: Pet) => {
    if (!canEdit) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit pets",
        variant: "destructive",
      })
      return
    }
    setSelectedPet(pet)
    setIsFormOpen(true)
  }

  const handleDeletePet = async (pet: Pet) => {
    if (!canDelete) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete pets",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`Are you sure you want to delete ${pet.name}?`)) {
      return
    }

    setPets(pets.filter((p) => p.id !== pet.id))
    toast({
      title: "Success",
      description: "Pet deleted successfully",
    })
  }

  const handleSubmitPet = async (petData: Omit<Pet, "id" | "created_at" | "updated_at" | "owner_name">) => {
    const owner = owners.find((o) => o.id === petData.owner_id)

    if (selectedPet) {
      // Update existing pet
      const updatedPet = {
        ...selectedPet,
        ...petData,
        owner_name: owner?.name || "",
        updated_at: new Date().toISOString(),
      }
      setPets(pets.map((p) => (p.id === selectedPet.id ? updatedPet : p)))
      toast({
        title: "Success",
        description: "Pet updated successfully",
      })
    } else {
      // Add new pet
      const newPet: Pet = {
        id: Math.max(...pets.map((p) => p.id)) + 1,
        ...petData,
        owner_name: owner?.name || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setPets([...pets, newPet])
      toast({
        title: "Success",
        description: "Pet created successfully",
      })
    }
    setIsFormOpen(false)
  }

  const columns = [
    { key: "name", label: "Pet Name" },
    { key: "owner_name", label: "Owner" },
    { key: "species", label: "Species" },
    { key: "breed", label: "Breed" },
    {
      key: "sex",
      label: "Sex",
      render: (value: string) => (
        <Badge variant={value === "Male" ? "default" : value === "Female" ? "secondary" : "outline"}>
          {value || "Unknown"}
        </Badge>
      ),
    },
    { key: "age", label: "Age", render: (value: number) => (value ? `${value} yrs` : "-") },
    { key: "weight", label: "Weight", render: (value: number) => (value ? `${value} lbs` : "-") },
  ]

  if (isLoading) {
    return (
      <AuthWrapper>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading pets...</div>
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
              <h1 className="text-3xl font-bold">Pets</h1>
              <p className="text-muted-foreground">Manage all pets and their information</p>
              {user?.role === "assistant" && (
                <p className="text-sm text-orange-600 mt-1">
                  Assistant access: You can create and edit pets, but cannot delete them.
                </p>
              )}
            </div>

            <DataTable
              title="Registered Pets"
              description="All pets registered in the system"
              data={pets}
              columns={columns}
              onAdd={canAdd ? handleAddPet : undefined}
              onEdit={canEdit ? handleEditPet : undefined}
              onDelete={canDelete ? handleDeletePet : undefined}
              searchPlaceholder="Search pets..."
              addButtonText="Add Pet"
            />

            <PetForm
              pet={selectedPet}
              owners={owners}
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              onSubmit={handleSubmitPet}
            />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    </AuthWrapper>
  )
}
