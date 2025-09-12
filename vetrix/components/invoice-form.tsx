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
import type { Invoice, Owner, Pet, Appointment } from "@/lib/database"

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
    owner_id: "",
    pet_id: "",
    appointment_id: "",
    invoice_date: "",
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
        owner_id: String(invoice.owner_id),
        pet_id: String(invoice.pet_id),
        appointment_id: invoice.appointment_id ? String(invoice.appointment_id) : "",
        invoice_date: invoice.invoice_date,
        status: invoice.status,
        notes: invoice.notes || "",
      })

      // Parse services from JSON string
      try {
        const parsedServices = JSON.parse(invoice.services) as string[]
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
        owner_id: "",
        pet_id: "",
        appointment_id: "",
        invoice_date: today,
        status: "pending",
        notes: "",
      })
      setServices([{ description: "", amount: 0 }])
    }
  }, [invoice, open])

  useEffect(() => {
    if (formData.owner_id) {
      const ownerPets = pets.filter((pet) => String(pet.owner_id) === formData.owner_id)
      setFilteredPets(ownerPets)

      // Reset pet selection if current pet doesn't belong to selected owner
      if (formData.pet_id && !ownerPets.find((pet) => String(pet.id) === formData.pet_id)) {
        setFormData((prev) => ({ ...prev, pet_id: "", appointment_id: "" }))
      }
    } else {
      setFilteredPets([])
      setFormData((prev) => ({ ...prev, pet_id: "", appointment_id: "" }))
    }
  }, [formData.owner_id, pets])

  useEffect(() => {
    if (formData.pet_id) {
      const petAppointments = appointments.filter((appointment) => String(appointment.pet_id) === formData.pet_id)
      setFilteredAppointments(petAppointments)

      // Reset appointment selection if current appointment doesn't belong to selected pet
      if (formData.appointment_id && !petAppointments.find((apt) => String(apt.id) === formData.appointment_id)) {
        setFormData((prev) => ({ ...prev, appointment_id: "" }))
      }
    } else {
      setFilteredAppointments([])
      setFormData((prev) => ({ ...prev, appointment_id: "" }))
    }
  }, [formData.pet_id, appointments])

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

      const invoiceData = {
        owner_id: Number(formData.owner_id),
        pet_id: Number(formData.pet_id),
        appointment_id: formData.appointment_id ? Number(formData.appointment_id) : undefined,
        invoice_date: formData.invoice_date,
        services: JSON.stringify(formattedServices),
        total_amount: calculateTotal(),
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
    const date = new Date(appointment.appointment_date).toLocaleDateString()
    const time = new Date(`2000-01-01T${appointment.appointment_time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    return `${date} at ${time} (${appointment.status})`
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
              <Label htmlFor="owner_id">Owner *</Label>
              <Select
                value={formData.owner_id}
                onValueChange={(value) => setFormData({ ...formData, owner_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an owner" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((owner) => (
                    <SelectItem key={owner.id} value={String(owner.id)}>
                      {owner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pet_id">Pet *</Label>
              <Select
                value={formData.pet_id}
                onValueChange={(value) => setFormData({ ...formData, pet_id: value })}
                disabled={!formData.owner_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.owner_id ? "Select a pet" : "Select an owner first"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredPets.map((pet) => (
                    <SelectItem key={pet.id} value={String(pet.id)}>
                      {pet.name} ({pet.species})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appointment_id">Related Appointment (Optional)</Label>
            <Select
              value={formData.appointment_id}
              onValueChange={(value) => setFormData({ ...formData, appointment_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.pet_id ? "Select an appointment" : "Select a pet first"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No appointment</SelectItem>
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
              <Label htmlFor="invoice_date">Invoice Date *</Label>
              <Input
                id="invoice_date"
                type="date"
                value={formData.invoice_date}
                onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
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
                <CardTitle className="text-lg">Services & Medications</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addService}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {services.map((service, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Service description (e.g., Annual exam, Vaccination)"
                      value={service.description}
                      onChange={(e) => updateService(index, "description", e.target.value)}
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Amount"
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
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Any additional notes about the invoice..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.owner_id || !formData.pet_id || calculateTotal() === 0}
            >
              {isSubmitting ? "Saving..." : invoice ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
