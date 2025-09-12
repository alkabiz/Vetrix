"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DataTable } from "@/components/data-table"
import { AppointmentForm } from "@/components/appointment-form"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, User, Heart } from "lucide-react"
import type { Appointment, Owner, Pet } from "@/lib/database"
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

const mockAppointments: Appointment[] = [
  {
    id: 1,
    pet_id: 1,
    pet_name: "Buddy",
    owner_id: 1,
    owner_name: "John Smith",
    appointment_date: "2024-02-15",
    appointment_time: "10:00",
    reason: "Annual checkup",
    assigned_vet: "Dr. Smith",
    status: "pending",
    created_at: "2024-02-10T09:00:00Z",
    updated_at: "2024-02-10T09:00:00Z",
  },
  {
    id: 2,
    pet_id: 2,
    pet_name: "Luna",
    owner_id: 2,
    owner_name: "Sarah Johnson",
    appointment_date: "2024-02-16",
    appointment_time: "14:30",
    reason: "Vaccination",
    assigned_vet: "Dr. Johnson",
    status: "completed",
    created_at: "2024-02-11T11:30:00Z",
    updated_at: "2024-02-16T15:00:00Z",
  },
  {
    id: 3,
    pet_id: 3,
    pet_name: "Max",
    owner_id: 3,
    owner_name: "Mike Wilson",
    appointment_date: "2024-02-17",
    appointment_time: "09:15",
    reason: "Dental cleaning",
    assigned_vet: "Dr. Brown",
    status: "pending",
    created_at: "2024-02-12T16:45:00Z",
    updated_at: "2024-02-12T16:45:00Z",
  },
]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [owners, setOwners] = useState<Owner[]>(mockOwners)
  const [pets, setPets] = useState<Pet[]>(mockPets)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()
  const { user } = useAuth()

  const canDelete = user?.role === "admin" || user?.role === "vet"
  const canEdit = user?.role === "admin" || user?.role === "vet" || user?.role === "assistant"
  const canAdd = user?.role === "admin" || user?.role === "vet" || user?.role === "assistant"

  const handleAddAppointment = () => {
    if (!canAdd) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to schedule appointments",
        variant: "destructive",
      })
      return
    }
    setSelectedAppointment(null)
    setIsFormOpen(true)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    if (!canEdit) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit appointments",
        variant: "destructive",
      })
      return
    }
    setSelectedAppointment(appointment)
    setIsFormOpen(true)
  }

  const handleDeleteAppointment = async (appointment: Appointment) => {
    if (!canDelete) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete appointments",
        variant: "destructive",
      })
      return
    }

    if (!confirm(`Are you sure you want to delete this appointment for ${appointment.pet_name}?`)) {
      return
    }

    setAppointments(appointments.filter((a) => a.id !== appointment.id))
    toast({
      title: "Success",
      description: "Appointment deleted successfully",
    })
  }

  const handleSubmitAppointment = async (
    appointmentData: Omit<Appointment, "id" | "created_at" | "updated_at" | "pet_name" | "owner_name">,
  ) => {
    const pet = pets.find((p) => p.id === appointmentData.pet_id)
    const owner = owners.find((o) => o.id === appointmentData.owner_id)

    if (selectedAppointment) {
      // Update existing appointment
      const updatedAppointment = {
        ...selectedAppointment,
        ...appointmentData,
        pet_name: pet?.name || "",
        owner_name: owner?.name || "",
        updated_at: new Date().toISOString(),
      }
      setAppointments(appointments.map((a) => (a.id === selectedAppointment.id ? updatedAppointment : a)))
      toast({
        title: "Success",
        description: "Appointment updated successfully",
      })
    } else {
      // Add new appointment
      const newAppointment: Appointment = {
        id: Math.max(...appointments.map((a) => a.id)) + 1,
        ...appointmentData,
        pet_name: pet?.name || "",
        owner_name: owner?.name || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setAppointments([...appointments, newAppointment])
      toast({
        title: "Success",
        description: "Appointment scheduled successfully",
      })
    }
    setIsFormOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="default">Pending</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const filteredAppointments = appointments.filter((appointment) => {
    if (statusFilter === "all") return true
    return appointment.status === statusFilter
  })

  const columns = [
    {
      key: "appointment_date",
      label: "Date",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {formatDate(value)}
        </div>
      ),
    },
    {
      key: "appointment_time",
      label: "Time",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {formatTime(value)}
        </div>
      ),
    },
    {
      key: "owner_name",
      label: "Owner",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          {value}
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
    { key: "assigned_vet", label: "Veterinarian" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => getStatusBadge(value),
    },
  ]

  // Calculate stats
  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    canceled: appointments.filter((a) => a.status === "canceled").length,
  }

  if (isLoading) {
    return (
      <AuthWrapper>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading appointments...</div>
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
              <h1 className="text-3xl font-bold">Appointments</h1>
              <p className="text-muted-foreground">Manage and schedule pet appointments</p>
              {user?.role === "assistant" && (
                <p className="text-sm text-orange-600 mt-1">
                  Assistant access: You can create and edit appointments, but cannot delete them.
                </p>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <div className="h-4 w-4 rounded-full bg-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Canceled</CardTitle>
                  <div className="h-4 w-4 rounded-full bg-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.canceled}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="status-filter" className="text-sm font-medium">
                  Filter by status:
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DataTable
              title="Scheduled Appointments"
              description={`${filteredAppointments.length} appointment${filteredAppointments.length !== 1 ? "s" : ""} ${statusFilter !== "all" ? `with ${statusFilter} status` : ""}`}
              data={filteredAppointments}
              columns={columns}
              onAdd={canAdd ? handleAddAppointment : undefined}
              onEdit={canEdit ? handleEditAppointment : undefined}
              onDelete={canDelete ? handleDeleteAppointment : undefined}
              searchPlaceholder="Search appointments..."
              addButtonText="Schedule Appointment"
            />

            <AppointmentForm
              appointment={selectedAppointment}
              owners={owners}
              pets={pets}
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
