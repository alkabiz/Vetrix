"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { MedicalRecord, Pet, Appointment } from "@/lib/database"

interface MedicalRecordFormProps {
  record?: MedicalRecord | null
  pets: Pet[]
  appointments: Appointment[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (record: Omit<MedicalRecord, "id" | "created_at" | "updated_at" | "pet_name">) => Promise<void>
}

export function MedicalRecordForm({
  record,
  pets,
  appointments,
  open,
  onOpenChange,
  onSubmit,
}: MedicalRecordFormProps) {
  const [formData, setFormData] = useState({
    pet_id: "",
    appointment_id: "",
    visit_date: "",
    reason_for_visit: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    if (record) {
      setFormData({
        pet_id: String(record.pet_id),
        appointment_id: record.appointment_id ? String(record.appointment_id) : "",
        visit_date: record.visit_date,
        reason_for_visit: record.reason_for_visit,
        diagnosis: record.diagnosis || "",
        treatment: record.treatment || "",
        notes: record.notes || "",
      })
    } else {
      // Set today's date as default
      const today = new Date().toISOString().split("T")[0]
      setFormData({
        pet_id: "",
        appointment_id: "",
        visit_date: today,
        reason_for_visit: "",
        diagnosis: "",
        treatment: "",
        notes: "",
      })
    }
  }, [record, open])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const recordData = {
        pet_id: Number(formData.pet_id),
        appointment_id: formData.appointment_id ? Number(formData.appointment_id) : undefined,
        visit_date: formData.visit_date,
        reason_for_visit: formData.reason_for_visit,
        diagnosis: formData.diagnosis || undefined,
        treatment: formData.treatment || undefined,
        notes: formData.notes || undefined,
      }

      await onSubmit(recordData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting medical record:", error)
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{record ? "Edit Medical Record" : "Create New Medical Record"}</DialogTitle>
          <DialogDescription>
            {record ? "Update the medical record details below." : "Enter the consultation details below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pet_id">Mascota *</Label>
            <Select value={formData.pet_id} onValueChange={(value) => setFormData({ ...formData, pet_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a pet" />
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={String(pet.id)}>
                    {pet.name} ({pet.speciesId}) - {pet.owner_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appointment_id">Cita relacionada (opcional)</Label>
            <Select
              value={formData.appointment_id}
              onValueChange={(value) => setFormData({ ...formData, appointment_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.pet_id ? "Selecciona una cita" : "Selecciona primero una mascota."} />
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

          <div className="space-y-2">
            <Label htmlFor="visit_date">Fecha de la visita *</Label>
            <Input
              id="visit_date"
              type="date"
              value={formData.visit_date}
              onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason_for_visit">Motivo de la visita *</Label>
            <Textarea
              id="reason_for_visit"
              value={formData.reason_for_visit}
              onChange={(e) => setFormData({ ...formData, reason_for_visit: e.target.value })}
              rows={2}
              placeholder="Por ejemplo, revisión anual, cojera, vacunación, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Textarea
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              rows={2}
              placeholder="Diagnóstico clínico o hallazgos..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment">Tratamiento</Label>
            <Textarea
              id="treatment"
              value={formData.treatment}
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              rows={3}
              placeholder="Plan de tratamiento, medicamentos, procedimientos, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas adicionales</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Cualquier observación o nota adicional..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.pet_id}>
              {isSubmitting ? "Guardando..." : record ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}