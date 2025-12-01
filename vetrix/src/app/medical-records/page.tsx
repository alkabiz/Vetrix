"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MedicalRecordForm } from "@/components/forms/medical-record/MedicalRecordForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { MedicalRecord } from "@/lib/database/database"
import { MedicalRecordDTO } from "@/lib/api/types/medical-record.types"
import { useMedicalRecords } from "@/src/hooks/useMedicalRecords"
import { usePets } from "@/src/hooks/usePets"
import { useAppointments } from "@/src/hooks/useAppointments"
import { MedicalRecordsStats } from "./components/MedicalRecordsStats"
import { MedicalRecordsFilters } from "./components/MedicalRecordsFilters"
import { MedicalRecordsTable } from "./components/MedicalRecordsTable"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { useAuth } from "@/contexts/auth-context"

export default function MedicalRecordsPage() {
  const { records = [], isLoading: isLoadingRecords, createRecord, updateRecord, deleteRecord } = useMedicalRecords()
  const { pets = [] } = usePets()
  const { appointments = [] } = useAppointments()

  const [selectedRecord, setSelectedRecord] = useState<MedicalRecordDTO | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [petFilter, setPetFilter] = useState<string>("all")
  const { toast } = useToast()
  const { user } = useAuth()

  const canModifyRecords = user && ["admin", "vet"].includes(user.role)

  const handleAddRecord = () => {
    if (!canModifyRecords) {
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

  const handleEditRecord = (record: MedicalRecordDTO) => {
    if (!canModifyRecords) {
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

  const handleDeleteRecord = async (record: MedicalRecordDTO) => {
    if (!canModifyRecords) {
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

    try {
      await deleteRecord.mutateAsync(record.id)
      toast({
        title: "Success",
        description: "Expediente médico eliminado correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el expediente médico.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitRecord = async (
    recordData: Omit<MedicalRecord, "id" | "created_at" | "updated_at" | "pet_name">,
  ) => {
    try {
      if (selectedRecord) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateRecord.mutateAsync({ id: selectedRecord.id, ...(recordData as any) })
        toast({
          title: "Success",
          description: "Expediente médico actualizado correctamente.",
        })
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await createRecord.mutateAsync(recordData as any)
        toast({
          title: "Success",
          description: "Expediente médico creado correctamente.",
        })
      }
      setIsFormOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el expediente médico.",
        variant: "destructive",
      })
    }
  }

  const filteredRecords = records.filter((record) => {
    if (petFilter === "all") return true
    return String(record.petId) === petFilter
  })

  if (isLoadingRecords) {
    return (
      <AuthWrapper>
        <DashboardLayout>
          <div className="flex items-center justify-center h-full">
            <p>Cargando expedientes médicos...</p>
          </div>
        </DashboardLayout>
      </AuthWrapper>
    )
  }

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

          <MedicalRecordsStats records={records} />

          <MedicalRecordsFilters
            currentFilter={petFilter}
            onFilterChange={setPetFilter}
            pets={pets}
          />

          <MedicalRecordsTable
            records={filteredRecords}
            canModify={!!canModifyRecords}
            onAdd={handleAddRecord}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
            filterStatus={petFilter}
          />

          {canModifyRecords && (
            <MedicalRecordForm
              record={selectedRecord as MedicalRecord | null}
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
