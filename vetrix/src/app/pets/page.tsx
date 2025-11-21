"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DataTable } from "@/components/ui/data-table"
import { PetForm } from "@/components/forms/pet/PetForm"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { Pet, Owner, Species, Breed, Color, Sex, SterilizationType, User } from "@/lib/database/database"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { canManagePets } from "@/lib/utils/permissions"

interface PetWithDisplay extends Omit<Pet, 'owner_name' | 'species' | 'breed' | 'sex' | 'age' | 'weight'> {
  owner_name: string
  species: string
  breed: string
  sex: string
  age: number
  weight: number
}

interface OwnerWithDisplay extends Omit<Owner, 'name'> {
  name: string
  phone: string
  email: string
  address: string
}

const mockSpecies: Species[] = [
  { id: 1, name: "Dog", scientificName: "Canis lupus familiaris", averageLifespanYears: 13, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: "Cat", scientificName: "Felis catus", averageLifespanYears: 15, isActive: true, createdAt: new Date(), updatedAt: new Date() },
]

const mockBreeds: Breed[] = [
  { id: 1, speciesId: 1, name: "Golden Retriever", sizeCategoryId: 4, averageWeightMin: 25, averageWeightMax: 34, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, speciesId: 2, name: "Siamese", sizeCategoryId: 2, averageWeightMin: 3, averageWeightMax: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },
]

const mockColors: Color[] = [
  { id: 1, name: "Golden", hexCode: "#FFD700", isActive: true, createdAt: new Date() },
  { id: 2, name: "Cream", hexCode: "#FFFDD0", isActive: true, createdAt: new Date() },
]

const mockSexes: Sex[] = [
  { id: 1, name: "Male", abbreviation: "M", isActive: true, createdAt: new Date() },
  { id: 2, name: "Female", abbreviation: "F", isActive: true, createdAt: new Date() },
]

const mockSterilizationTypes: SterilizationType[] = [
  { id: 1, code: "NEUTER", description: "Neutering", isActive: true, createdAt: new Date() },
  { id: 2, code: "SPAY", description: "Spaying", isActive: true, createdAt: new Date() },
]

const mockOwners: OwnerWithDisplay[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Smith",
    name: "John Smith",
    phonePrimary: "(555) 123-4567",
    email: "john.smith@email.com",
    addressStreet: "123 Main St",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, ST 12345",
    marketingConsent: true,
    dataProcessingConsent: true,
    isActive: true,
    creditLimit: 1000,
    createdAt: new Date("2024-01-15T10:30:00Z"),
    updatedAt: new Date("2024-01-15T10:30:00Z"),
  },
]

const mockPets: PetWithDisplay[] = [
  {
    id: 1,
    petNumber: "PET001",
    name: "Buddy",
    ownerId: 1,
    speciesId: 1,
    breedId: 1,
    sexId: 1,
    primaryColorId: 1,
    owner_name: "John Smith",
    species: "Dog",
    breed: "Golden Retriever",
    sex: "Male",
    age: 5,
    weight: 65,
    isBirthEstimated: false,
    isActive: true,
    createdAt: new Date("2024-01-15T11:00:00Z"),
    updatedAt: new Date("2024-01-15T11:00:00Z"),
  },
]

export default function PetsPage() {
  const [pets, setPets] = useState<PetWithDisplay[]>(mockPets)
  const [selectedPet, setSelectedPet] = useState<PetWithDisplay | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const permissions = canManagePets(user)

  const handleAddPet = () => {
    if (!permissions.canAdd) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permiso para agregar mascotas.",
        variant: "destructive",
      })
      return
    }
    setSelectedPet(null)
    setIsFormOpen(true)
  }

  const handleEditPet = (pet: PetWithDisplay) => {
    if (!permissions.canEdit) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permiso para editar mascotas.",
        variant: "destructive",
      })
      return
    }
    setSelectedPet(pet)
    setIsFormOpen(true)
  }

  const handleDeletePet = async (pet: PetWithDisplay) => {
    if (!permissions.canDelete) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permiso para eliminar mascotas.",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`¿Estás seguro de que quieres eliminar a ${pet.name}?`)) {
      return
    }

    setPets(pets.filter((p) => p.id !== pet.id))
    toast({
      title: "Éxito",
      description: "Mascota eliminada correctamente.",
    })
  }

  const handleSubmitPet = async (petData: Omit<Pet, "id" | "createdAt" | "updatedAt">) => {
    try {
      const owner = mockOwners.find((o) => o.id === petData.ownerId)

      if (selectedPet) {
        // Update existing pet
        const updatedPet: PetWithDisplay = {
          ...selectedPet,
          ...petData,
          owner_name: owner?.name || selectedPet.owner_name,
          species: mockSpecies.find(s => s.id === petData.speciesId)?.name || selectedPet.species,
          breed: mockBreeds.find(b => b.id === petData.breedId)?.name || selectedPet.breed,
          sex: mockSexes.find(s => s.id === petData.sexId)?.name || selectedPet.sex,
          updatedAt: new Date(),
        }
        setPets(pets.map((p) => (p.id === selectedPet.id ? updatedPet : p)))
        toast({
          title: "Éxito",
          description: "Mascota actualizada con éxito",
        })
      } else {
        // Add new pet
        const newPet: PetWithDisplay = {
          id: Math.max(0, ...pets.map((p) => p.id)) + 1,
          ...petData,
          owner_name: owner?.name || "",
          species: mockSpecies.find(s => s.id === petData.speciesId)?.name || "",
          breed: mockBreeds.find(b => b.id === petData.breedId)?.name || "",
          sex: mockSexes.find(s => s.id === petData.sexId)?.name || "",
          age: 0, // You'll need to calculate this from dateOfBirth
          weight: 0, // This should come from form data
          isBirthEstimated: petData.isBirthEstimated || false,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        setPets([...pets, newPet])
        toast({
          title: "Éxito",
          description: "Mascota creada con éxito.",
        })
      }
      setIsFormOpen(false)
      setSelectedPet(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la mascota.",
        variant: "destructive",
      })
    }
  }

  const columns = [
    { key: "name", label: "Nombre de Mascota" },
    { key: "owner_name", label: "Propietario" },
    { key: "species", label: "Especie" },
    { key: "breed", label: "Raza" },
    {
      key: "sex",
      label: "Sexo",
      render: (value: string) => (
        <Badge variant={value === "Male" ? "default" : value === "Female" ? "secondary" : "outline"}>
          {value || "Desconocido"}
        </Badge>
      ),
    },
    { key: "age", label: "Edad", render: (value: number) => (value ? `${value} años` : "-") },
    { key: "weight", label: "Peso", render: (value: number) => (value ? `${value} lbs` : "-") },
  ]

  if (isLoading) {
    return (
      <AuthWrapper>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Cargando mascotas...</div>
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
              <h1 className="text-3xl font-bold">Mascotas</h1>
              <p className="text-muted-foreground">Administra todas las mascotas y su información.</p>
              {user?.role === "assistant" && (
                <p className="text-sm text-orange-600 mt-1">
                  Acceso de asistente: puedes crear y editar mascotas, pero no puedes eliminarlas.
                </p>
              )}
            </div>

            <DataTable
              title="Mascotas registradas"
              description="Todas las mascotas registradas en el sistema"
              data={pets}
              columns={columns}
              onAdd={permissions.canAdd ? handleAddPet : undefined}
              onEdit={permissions.canEdit ? handleEditPet : undefined}
              onDelete={permissions.canDelete ? handleDeletePet : undefined}
              searchPlaceholder="Buscar mascotas..."
              addButtonText="Añadir mascota"
            />

            <PetForm
              pet={selectedPet}
              owners={mockOwners}
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              onSubmit={handleSubmitPet}
              species={mockSpecies}
              breeds={mockBreeds}
              colors={mockColors}
              sexes={mockSexes}
              sterilizationTypes={mockSterilizationTypes}
            />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    </AuthWrapper>
  )
}