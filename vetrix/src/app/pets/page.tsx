"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PetForm } from "@/components/forms/pet/PetForm"
import { useToast } from "@/hooks/use-toast"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { canManagePets } from "@/lib/utils/permissions"
import { usePets } from "@/src/hooks/usePets"
import { useOwners } from "@/src/hooks/useOwners"
import { useSpecies } from "@/src/hooks/useSpecies"
import { useBreeds } from "@/src/hooks/useBreeds"
import { useColors } from "@/src/hooks/useColors"
import { useSexes } from "@/src/hooks/useSexes"
import { useSterilizationTypes } from "@/src/hooks/useSterilizationTypes"
import { PetsTable } from "@/components/pets/PetsTable"
import { PetStats } from "@/components/pets/PetStats"
import { PetFilters } from "@/components/pets/PetFilters"
import { PetDTO, PetInput } from "@/lib/api/types/pet.types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function PetsPage() {
  // Data hooks
  const { pets = [], isLoading: petsLoading, createPet, updatePet, deletePet } = usePets()
  const { owners = [], isLoading: ownersLoading } = useOwners()
  const { species = [], isLoading: speciesLoading } = useSpecies()
  const { breeds = [], isLoading: breedsLoading } = useBreeds()
  const { colors = [], isLoading: colorsLoading } = useColors()
  const { sexes = [], isLoading: sexesLoading } = useSexes()
  const { sterilizationTypes = [], isLoading: sterilizationTypesLoading } = useSterilizationTypes()

  // UI state
  const [selectedPet, setSelectedPet] = useState<PetDTO | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const { toast } = useToast()
  const { user } = useAuth()

  const permissions = canManagePets(user)

  // Check if any data is still loading
  const isLoading = petsLoading || ownersLoading || speciesLoading ||
    breedsLoading || colorsLoading || sexesLoading ||
    sterilizationTypesLoading

  const handleAddPet = () => {
    if (!permissions.canAdd) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to add pets.",
        variant: "destructive",
      })
      return
    }
    setSelectedPet(null)
    setIsFormOpen(true)
  }

  const handleEditPet = (pet: PetDTO) => {
    if (!permissions.canEdit) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to edit pets.",
        variant: "destructive",
      })
      return
    }
    setSelectedPet(pet)
    setIsFormOpen(true)
  }

  const handleDeletePet = async (pet: PetDTO) => {
    if (!permissions.canDelete) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to delete pets.",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`Are you sure you want to delete ${pet.name}?`)) {
      return
    }

    deletePet.mutate(pet.id)
  }

  const handleSubmitPet = async (petData: PetInput) => {
    try {
      if (selectedPet) {
        await updatePet.mutateAsync({ id: selectedPet.id, data: petData })
      } else {
        await createPet.mutateAsync(petData)
      }
      setIsFormOpen(false)
      setSelectedPet(null)
    } catch (error) {
      // Error handling is done in the mutation callbacks
      console.error(error)
    }
  }

  // Client-side filtering
  const filteredPets = pets.filter((pet) => {
    const searchLower = searchTerm.toLowerCase()
    const name = (pet.name || "").toLowerCase()
    const ownerName = (pet.owner_name || "").toLowerCase()
    const species = (pet.species_name || "").toLowerCase()
    const breed = (pet.breed_name || "").toLowerCase()

    return name.includes(searchLower) ||
      ownerName.includes(searchLower) ||
      species.includes(searchLower) ||
      breed.includes(searchLower)
  })

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
              <p className="text-muted-foreground">Manage all pets and their information.</p>
              {user?.role === "assistant" && (
                <p className="text-sm text-orange-600 mt-1">
                  Assistant Access: You can create and edit pets, but cannot delete them.
                </p>
              )}
            </div>

            <PetStats pets={pets} />

            <div className="flex items-center justify-between">
              <PetFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              {permissions.canAdd && (
                <Button onClick={handleAddPet}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Pet
                </Button>
              )}
            </div>

            <PetsTable
              pets={filteredPets}
              onEdit={permissions.canEdit ? handleEditPet : undefined}
              onDelete={permissions.canDelete ? handleDeletePet : undefined}
            />

            <PetForm
              pet={selectedPet}
              owners={owners}
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              onSubmit={handleSubmitPet}
              species={species}
              breeds={breeds}
              colors={colors}
              sexes={sexes}
              sterilizationTypes={sterilizationTypes}
            />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    </AuthWrapper>
  )
}