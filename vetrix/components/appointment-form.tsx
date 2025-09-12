"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Appointment, Owner, Pet } from "@/lib/database"

interface AppointmentFormProps {
  appointment?: Appointment | null
  owners: Owner[]
  pets: Pet[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (
    appointment: Omit<Appointment, "id" | "created_at" | "updated_at" | "pet_name" | "owner_name">,
  ) => Promise<void>
}

export function AppointmentForm({ appointment, owners, pets, open, onOpenChange, onSubmit }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    owner_id: "",
    pet_id: "",
    appointment_date: "",
    appointment_time: "",
    assigned_vet: "",
    status: "pending" as "pending" | "completed" | "canceled",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filteredPets, setFilteredPets] = useState<Pet[]>([])

  useEffect(() => {
    if (appointment) {
      setFormData({
        owner_id: String(appointment.owner_id),
        pet_id: String(appointment.pet_id),
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        assigned_vet: appointment.assigned_vet || "",
        status: appointment.status,
        notes: appointment.notes || "",
      })
    } else {
      setFormData({
        owner_id: "",
        pet_id: "",
        appointment_date: "",
        appointment_time: "",
        assigned_vet: "",
        status: "pending",
        notes: "",
      })
    }
  }, [appointment, open])

  useEffect(() => {
    if (formData.owner_id) {
      const ownerPets = pets.filter((pet) => String(pet.owner_id) === formData.owner_id)
      setFilteredPets(ownerPets)

      // Reset pet selection if current pet doesn't belong to selected owner
      if (formData.pet_id && !ownerPets.find((pet) => String(pet.id) === formData.pet_id)) {
        setFormData((prev) => ({ ...prev, pet_id: "" }))
      }
    } else {
      setFilteredPets([])
      setFormData((prev) => ({ ...prev, pet_id: "" }))
    }
  }, [formData.owner_id, pets])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const appointmentData = {
        owner_id: Number(formData.owner_id),
        pet_id: Number(formData.pet_id),
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        assigned_vet: formData.assigned_vet || undefined,
        status: formData.status,
        notes: formData.notes || undefined,
      }

      await onSubmit(appointmentData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting appointment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{appointment ? "Edit Appointment" : "Schedule New Appointment"}</DialogTitle>
          <DialogDescription>
            {appointment ? "Update the appointment details below." : "Enter the appointment information below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="owner_id">Owner *</Label>
            <Select value={formData.owner_id} onValueChange={(value) => setFormData({ ...formData, owner_id: value })}>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment_date">Date *</Label>
              <Input
                id="appointment_date"
                type="date"
                min={today}
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointment_time">Time *</Label>
              <Input
                id="appointment_time"
                type="time"
                value={formData.appointment_time}
                onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigned_vet">Assigned Veterinarian</Label>
            <Select
              value={formData.assigned_vet}
              onValueChange={(value) => setFormData({ ...formData, assigned_vet: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a veterinarian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dr. Anderson">Dr. Anderson</SelectItem>
                <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                <SelectItem value="Dr. Williams">Dr. Williams</SelectItem>
                <SelectItem value="Dr. Brown">Dr. Brown</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Any additional notes about the appointment..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.owner_id || !formData.pet_id}>
              {isSubmitting ? "Saving..." : appointment ? "Update" : "Schedule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
