"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DataTable } from "@/components/data-table"
import { MedicalRecordForm } from "@/components/medical-record-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { FileText, Calendar, Heart, Stethoscope } from "lucide-react"
import type { MedicalRecord, Pet, Appointment } from "@/lib/database"
import { AuthWrapper } from "@/components/auth-wrapper"
import { useAuth } from "@/contexts/auth-context"

const mockRecords: MedicalRecord[] = [
  {
    id: 1,
    pet_id: 1,
    pet_name: "Buddy",
    appointment_id: 1,
    visit_date: "2024-01-15",
    reason_for_visit: "Annual checkup",
    diagnosis: "Healthy, minor dental tartar",
    treatment: "Dental cleaning recommended",
    notes: "Overall good health, weight normal",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    pet_id: 2,
    pet_name: "Whiskers",
    appointment_id: 2,
    visit_date: "2024-01-20",
    reason_for_visit: "Limping on front paw",
    diagnosis: "Minor sprain",
    treatment: "Rest and anti-inflammatory medication",
    notes: "Should improve within 7-10 days",
    created_at: "2024-01-20T14:30:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
  {
    id: 3,
    pet_id: 3,
    pet_name: "Charlie",
    appointment_id: 3,
    visit_date: "2024-01-25",
    reason_for_visit: "Vaccination",
    diagnosis: "Healthy",
    treatment: "Annual vaccinations administered",
    notes: "Next vaccination due in 12 months",
    created_at: "2024-01-25T09:15:00Z",
    updated_at: "2024-01-25T09:15:00Z",
  },
]

const mockPets: Pet[] = [
  {
    id: 1,
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    age: 5,
    owner_id: 1,
    owner_name: "John Smith",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Whiskers",
    species: "Cat",
    breed: "Persian",
    age: 3,
    owner_id: 2,
    owner_name: "Jane Doe",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Charlie",
    species: "Dog",
    breed: "Beagle",
    age: 2,
    owner_id: 3,
    owner_name: "Bob Johnson",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

const mockAppointments: Appointment[] = [
  {
    id: 1,
    pet_id: 1,
    pet_name: "Buddy",
    owner_name: "John Smith",
    appointment_date: "2024-01-15",
    appointment_time: "10:00",
    veterinarian: "Dr. Smith",
    reason: "Annual checkup",
    status: "completed",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    pet_id: 2,
    pet_name: "Whiskers",
    owner_name: "Jane Doe",
    appointment_date: "2024-01-20",
    appointment_time: "14:30",
    veterinarian: "Dr. Johnson",
    reason: "Limping",
    status: "completed",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
  {
    id: 3,
    pet_id: 3,
    pet_name: "Charlie",
    owner_name: "Bob Johnson",
    appointment_date: "2024-01-25",
    appointment_time: "09:15",
    veterinarian: "Dr. Smith",
    reason: "Vaccination",
    status: "completed",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-25T09:15:00Z",
  },
]

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>(mockRecords)
  const [pets] = useState<Pet[]>(mockPets)
  const [appointments] = useState<Appointment[]>(mockAppointments)
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [petFilter, setPetFilter] = useState<string>("all")
  const { toast } = useToast()
  const { user } = useAuth()

  const handleAddRecord = () => {
    if (!user || !["admin", "vet"].includes(user.role)) {
      toast({
        title: "Acceso denegado",
        description: "Only veterinarians and administrators can create medical records",
        variant: "destructive",
      })
      return
    }
    setSelectedRecord(null)
    setIsFormOpen(true)
  }

  const handleEditRecord = (record: MedicalRecord) => {
    if (!user || !["admin", "vet"].includes(user.role)) {
      toast({
        title: "Acceso denegado",
        description: "Solo los veterinarios y los administradores pueden editar los registros médicos.",
        variant: "destructive",
      })
      return
    }
    setSelectedRecord(record)
    setIsFormOpen(true)
  }

  const handleDeleteRecord = async (record: MedicalRecord) => {
    if (!user || !["admin", "vet"].includes(user.role)) {
      toast({
        title: "Acceso denegado",
        description: "Solo los veterinarios y los administradores pueden eliminar los registros médicos.",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`¿Está seguro de que desea eliminar este expediente médico de ${record.pet_name}?`)) {
      return
    }

    setRecords(records.filter((r) => r.id !== record.id))
    toast({
      title: "Success",
      description: "Expediente médico eliminado correctamente.",
    })
  }

  const handleSubmitRecord = async (
    recordData: Omit<MedicalRecord, "id" | "created_at" | "updated_at" | "pet_name">,
  ) => {
    if (selectedRecord) {
      // Update existing record
      const updatedRecord = {
        ...selectedRecord,
        ...recordData,
        pet_name: pets.find((p) => p.id === recordData.petId)?.name || "",
        updated_at: new Date().toISOString(),
      }
      setRecords(records.map((r) => (r.id === selectedRecord.id ? updatedRecord : r)))
      toast({
        title: "Success",
        description: "Expediente médico actualizado correctamente.",
      })
    } else {
      // Create new record
      const newRecord: MedicalRecord = {
        ...recordData,
        id: Math.max(...records.map((r) => r.id)) + 1,
        pet_name: pets.find((p) => p.id === recordData.petId)?.name || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setRecords([...records, newRecord])
      toast({
        title: "Success",
        description: "Expediente médico creado correctamente.",
      })
    }
    setIsFormOpen(false)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredRecords = records.filter((record) => {
    if (petFilter === "all") return true
    return String(record.petId) === petFilter
  })

  const columns = [
    {
      key: "visit_date",
      label: "Visit Date",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: "pet_name",
      label: "Pet",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-muted-foreground" />
          {value}
        </div>
      ),
    },
    {
      key: "reason_for_visit",
      label: "Reason for Visit",
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "diagnosis",
      label: "Diagnosis",
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value || <span className="text-muted-foreground">-</span>}
        </div>
      ),
    },
    {
      key: "treatment",
      label: "Treatment",
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value || <span className="text-muted-foreground">-</span>}
        </div>
      ),
    },
  ]

  // Calculate stats
  const stats = {
    total: records.length,
    thisMonth: records.filter((r) => {
      const recordDate = new Date(r.visit_date)
      const now = new Date()
      return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear()
    }).length,
    uniquePets: new Set(records.map((r) => r.petId)).size,
  }

  const canModifyRecords = user && ["admin", "vet"].includes(user.role)

  return (
    <AuthWrapper>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Historial médico</h1>
            <p className="text-muted-foreground">
              {user?.role === "assistant"
                ? "Ver consultas, diagnósticos y tratamientos de mascotas (acceso de solo lectura)."
                : "Realice un seguimiento de las consultas, diagnósticos y tratamientos de mascotas."}
            </p>
          </div>

          {user?.role === "assistant" && (
            <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Acceso asistente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-amber-700 text-sm">
                  Usted tiene acceso de solo lectura a los registros médicos. Solo los veterinarios y los administradores pueden crear, editar
                  o eliminar registros médicos.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de registros</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Todos los expedientes médicos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Este mes</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.thisMonth}</div>
                <p className="text-xs text-muted-foreground">Registros de este mes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mascotas únicas</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.uniquePets}</div>
                <p className="text-xs text-muted-foreground">Mascotas con antecedentes</p>
              </CardContent>
            </Card>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="pet-filter" className="text-sm font-medium">
                Filtrar por mascota:
              </label>
              <Select value={petFilter} onValueChange={setPetFilter}>
                <SelectTrigger className="w-60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las mascotas</SelectItem>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={String(pet.id)}>
                      {pet.name} ({pet.speciesId}) - {pet.owner_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DataTable
            title="Historial médico"
            description={`${filteredRecords.length} historial médico${filteredRecords.length !== 1 ? "s" : ""} ${petFilter !== "all" ? `for selected pet` : ""}`}
            data={filteredRecords}
            columns={columns}
            onAdd={canModifyRecords ? handleAddRecord : undefined}
            onEdit={canModifyRecords ? handleEditRecord : undefined}
            onDelete={canModifyRecords ? handleDeleteRecord : undefined}
            searchPlaceholder="Buscar expedientes médicos..."
            addButtonText="Añadir historial médico"
          />

          {canModifyRecords && (
            <MedicalRecordForm
              record={selectedRecord}
              pets={pets}
              appointments={appointments}
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              onSubmit={handleSubmitRecord}
            />
          )}
        </div>
      </DashboardLayout>
    </AuthWrapper>
  )
}
