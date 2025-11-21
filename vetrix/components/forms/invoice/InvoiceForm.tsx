"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { Invoice, Owner, Pet, Appointment } from "@/lib/database/database"

interface ServiceItem {
  description: string
  amount: number
}

interface InvoiceFormProps {
  invoice?: Invoice | null
  owners: Owner[]
  pets: Pet[]
  appointments: Appointment[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (invoice: Omit<Invoice, "id" | "created_at" | "updated_at" | "owner_name" | "pet_name">) => Promise<void>
}

export function InvoiceForm({ invoice, owners, pets, appointments, open, onOpenChange, onSubmit }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    ownerId: "",
    petId: "",
    appointmentId: "",
    invoiceDate: "",
    status: "pending" as "pending" | "paid" | "overdue",
    notes: "",
  })
  const [services, setServices] = useState<ServiceItem[]>([{ description: "", amount: 0 }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filteredPets, setFilteredPets] = useState<Pet[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    if (invoice) {
      setFormData({
        ownerId: String(invoice.ownerId),
        petId: String(invoice.petId),
        appointmentId: invoice.appointmentId ? String(invoice.appointmentId) : "",
        invoiceDate: invoice.invoiceDate,
        status: invoice.status,
        notes: invoice.notes || "",
      })

      // Parse services from JSON string
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const servicesData = (invoice as any).services
        let parsedServices: string[] = []

        if (typeof servicesData === 'string') {
          parsedServices = JSON.parse(servicesData)
        } else if (Array.isArray(servicesData)) {
          parsedServices = servicesData
        }

        const serviceItems = parsedServices.map((service) => {
          const match = service.match(/^(.+): \$(\d+(?:\.\d{2})?)$/)
          if (match) {
            return { description: match[1], amount: Number.parseFloat(match[2]) }
          }
          return { description: service, amount: 0 }
        })
        setServices(serviceItems.length > 0 ? serviceItems : [{ description: "", amount: 0 }])
      } catch {
        setServices([{ description: "", amount: 0 }])
      }
    } else {
      // Set today's date as default
      const today = new Date().toISOString().split("T")[0]
      setFormData({
        ownerId: "",
        petId: "",
        appointmentId: "",
        invoiceDate: today,
        status: "pending",
        notes: "",
      })
      setServices([{ description: "", amount: 0 }])
    }
  }, [invoice, open])

  useEffect(() => {
    if (formData.ownerId) {
      const ownerPets = pets.filter((pet) => String(pet.ownerId) === formData.ownerId)
      setFilteredPets(ownerPets)

      // Reset pet selection if current pet doesn't belong to selected owner
      if (formData.petId && !ownerPets.find((pet) => String(pet.id) === formData.petId)) {
        setFormData((prev) => ({ ...prev, petId: "", appointmentId: "" }))
      }
    } else {
      setFilteredPets([])
      setFormData((prev) => ({ ...prev, petId: "", appointmentId: "" }))
    }
  }, [formData.ownerId, pets])

  useEffect(() => {
    if (formData.petId) {
      const petAppointments = appointments.filter((appointment) => String(appointment.petId) === formData.petId)
      setFilteredAppointments(petAppointments)

      // Reset appointment selection if current appointment doesn't belong to selected pet
      if (formData.appointmentId && !petAppointments.find((apt) => String(apt.id) === formData.appointmentId)) {
        setFormData((prev) => ({ ...prev, appointmentId: "" }))
      }
    } else {
      setFilteredAppointments([])
      setFormData((prev) => ({ ...prev, appointmentId: "" }))
    }
  }, [formData.petId, appointments])

  const addService = () => {
    setServices([...services, { description: "", amount: 0 }])
  }

  const removeService = (index: number) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index))
    }
  }

  const updateService = (index: number, field: keyof ServiceItem, value: string | number) => {
    const updatedServices = services.map((service, i) => {
      if (i === index) {
        return { ...service, [field]: value }
      }
      return service
    })
    setServices(updatedServices)
  }

  const calculateTotal = () => {
    return services.reduce((total, service) => total + (service.amount || 0), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Format services as JSON string array
      const formattedServices = services
        .filter((service) => service.description.trim() && service.amount > 0)
        .map((service) => `${service.description}: $${service.amount.toFixed(2)}`)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invoiceData: any = {
        ownerId: Number(formData.ownerId),
        petId: Number(formData.petId),
        appointmentId: formData.appointmentId ? Number(formData.appointmentId) : undefined,
        invoiceDate: formData.invoiceDate,
        services: JSON.stringify(formattedServices),
        totalAmount: calculateTotal(),
        status: formData.status,
        notes: formData.notes || undefined,
      }

      await onSubmit(invoiceData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting invoice:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatAppointmentOption = (appointment: Appointment) => {
    const date = new Date(appointment.appointmentDate).toLocaleDateString()
    // Assuming appointmentTime might not be on the interface based on previous file read, 
    // but if it is, we use it. If not, we just show date.
    // The previous code used appointment.appointment_time, let's check if we should keep it or not.
    // The interface showed appointmentDate but not explicit time field in the snippet I saw?
    // Wait, let's look at the Appointment interface again.
    // It has appointmentDatetime: Date and appointmentDate: string.
    // It doesn't seem to have appointment_time.
    // I will use appointmentDatetime for time if available.

    let timeString = ""
    if (appointment.appointmentDatetime) {
      timeString = new Date(appointment.appointmentDatetime).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    }

    return `${date} ${timeString ? "at " + timeString : ""} (${appointment.statusId})`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{invoice ? "Edit Invoice" : "Create New Invoice"}</DialogTitle>
          <DialogDescription>
            {invoice ? "Update the invoice details below." : "Enter the invoice information below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerId">Propietario *</Label>
              <Select
                value={formData.ownerId}
                onValueChange={(value) => setFormData({ ...formData, ownerId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an owner" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((owner) => (
                    <SelectItem key={owner.id} value={String(owner.id)}>
                      {owner.firstName} {owner.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="petId">Mascota *</Label>
              <Select
                value={formData.petId}
                onValueChange={(value) => setFormData({ ...formData, petId: value })}
                disabled={!formData.ownerId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.ownerId ? "Selecciona una mascota" : "Seleccione primero un propietario."} />
                </SelectTrigger>
                <SelectContent>
                  {filteredPets.map((pet) => (
                    <SelectItem key={pet.id} value={String(pet.id)}>
                      {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appointmentId">Cita relacionada (opcional)</Label>
            <Select
              value={formData.appointmentId}
              onValueChange={(value) => setFormData({ ...formData, appointmentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.petId ? "Selecciona una cita" : "Seleccione primero una mascota."} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin cita previa</SelectItem>
                {filteredAppointments.map((appointment) => (
                  <SelectItem key={appointment.id} value={String(appointment.id)}>
                    {formatAppointmentOption(appointment)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Fecha de la factura *</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Services Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Servicios y medicamentos</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addService}>
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir servicio
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {services.map((service, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Descripción del servicio (por ejemplo, examen anual, vacunación)"
                      value={service.description}
                      onChange={(e) => updateService(index, "description", e.target.value)}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Importe"
                      value={service.amount || ""}
                      onChange={(e) => updateService(index, "amount", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeService(index)}
                    disabled={services.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex justify-end pt-2 border-t">
                <div className="text-lg font-semibold">Total: ${calculateTotal().toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Cualquier observación adicional sobre la factura..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.ownerId || !formData.petId || calculateTotal() === 0}
            >
              {isSubmitting ? "Guardando..." : invoice ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}