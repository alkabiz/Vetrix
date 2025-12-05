"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AppointmentForm } from "@/components/forms/appointment/AppointmentForm"
import { useToast } from "@/hooks/use-toast"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/contexts/auth-context"
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment
} from "@/hooks/api/use-appointments"
import { useOwners } from "@/hooks/api/use-owners"
import { usePets } from "@/hooks/api/use-pets"
import { AppointmentsTable } from "./components/AppointmentsTable"
import { AppointmentStats } from "./components/AppointmentStats"
import { AppointmentFilters } from "./components/AppointmentFilters"
import type { AppointmentDTO, CreateAppointmentDTO, UpdateAppointmentDTO } from "@/lib/api/types/appointment.types"

export default function AppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDTO | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()
  const { user } = useAuth()

  // API Hooks
  const { data: appointments = [], isLoading: isLoadingAppointments } = useAppointments()
  const { data: owners = [] } = useOwners()
  const { data: pets = [] } = usePets()

  const createAppointmentMutation = useCreateAppointment()
  const updateAppointmentMutation = useUpdateAppointment()
  const deleteAppointmentMutation = useDeleteAppointment()

  const canDelete = user?.roleId === 1 || user?.roleId === 2
  const canEdit = user?.roleId === 1 || user?.roleId === 2 || user?.roleId === 3
  const canAdd = user?.roleId === 1 || user?.roleId === 2 || user?.roleId === 3

  const handleAddAppointment = () => {
    if (!canAdd) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permiso para programar citas.",
        variant: "destructive",
      })
      return
    }
    setSelectedAppointment(null)
    setIsFormOpen(true)
  }

  const handleEditAppointment = (appointment: AppointmentDTO) => {
    if (!canEdit) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permiso para editar citas.",
        variant: "destructive",
      })
      return
    }
    setSelectedAppointment(appointment)
    setIsFormOpen(true)
  }

  const handleDeleteAppointment = async (appointment: AppointmentDTO) => {
    if (!canDelete) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permiso para eliminar citas.",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`¿Está seguro de que desea eliminar esta cita para ${appointment.petName}?`)) {
      return
    }

    try {
      await deleteAppointmentMutation.mutateAsync(appointment.id.toString())
      toast({
        title: "Éxito",
        description: "Cita eliminada con éxito.",
      })
    } catch (error) {
      // Error handled by mutation hook
    }
  }

  const handleSubmitAppointment = async (data: CreateAppointmentDTO | UpdateAppointmentDTO) => {
    try {
      if (selectedAppointment) {
        await updateAppointmentMutation.mutateAsync({
          id: selectedAppointment.id.toString(),
          ...(data as UpdateAppointmentDTO)
        })
      } else {
        await createAppointmentMutation.mutateAsync(data as CreateAppointmentDTO)
      }
      setIsFormOpen(false)
    } catch (error) {
      // Error handled by mutation hook
    }
  }

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment: AppointmentDTO) => {
    if (statusFilter === "all") return true
    return appointment.status === statusFilter
  })

  // Calculate stats
  const stats = {
    total: appointments.length,
    pending: appointments.filter((a: AppointmentDTO) => a.status === "pending").length,
    completed: appointments.filter((a: AppointmentDTO) => a.status === "completed").length,
    canceled: appointments.filter((a: AppointmentDTO) => a.status === "canceled").length,
  }

  return (
    <AuthWrapper>
      <ProtectedRoute requiredPermission="view_all">
        <DashboardLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Citas</h1>
              <p className="text-muted-foreground">Gestionar y programar citas para mascotas</p>
              {user?.roleId === 3 && (
                <p className="text-sm text-orange-600 mt-1">
                  Acceso de asistente: puede crear y editar citas, pero no eliminarlas.
                </p>
              )}
            </div>

            <AppointmentStats stats={stats} />

            <AppointmentFilters
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
            />

            <AppointmentsTable
              appointments={filteredAppointments}
              isLoading={isLoadingAppointments}
              onAdd={canAdd ? handleAddAppointment : undefined}
              onEdit={canEdit ? handleEditAppointment : undefined}
              onDelete={canDelete ? handleDeleteAppointment : undefined}
              statusFilter={statusFilter}
            />

            <AppointmentForm
              appointment={selectedAppointment}
              owners={owners}
              pets={pets}
              veterinarians={[]} // TODO: Fetch veterinarians
              statusOptions={[]} // TODO: Fetch status options
              typeOptions={[]} // TODO: Fetch type options
              priorityOptions={[]} // TODO: Fetch priority options
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              onSubmit={handleSubmitAppointment}
            />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    </AuthWrapper>
  )
}
