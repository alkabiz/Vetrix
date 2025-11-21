"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { MedicalRecord, Pet, Appointment } from "@/lib/database/database"

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
    petId: "",
    appointmentId: "",
    visit_date: "",
    chiefComplaint: "",
    historyPresentIllness: "",
    prognosisNotes: "",
    veterinarianNotes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    if (record) {
      setFormData({
        petId: String(record.petId),
        appointmentId: record.appointmentId ? String(record.appointmentId) : "",
        visit_date: String(record.visit_date),
        chiefComplaint: record.chiefComplaint,
        historyPresentIllness: record.historyPresentIllness || "",
        prognosisNotes: record.prognosisNotes || "",
        veterinarianNotes: record.veterinarianNotes || "",
      })
    } else {
      // Set today's date as default
      const today = new Date().toISOString().split("T")[0]
      setFormData({
        petId: "",
        appointmentId: "",
        visit_date: today,
        chiefComplaint: "",
        historyPresentIllness: "",
        prognosisNotes: "",
        veterinarianNotes: "",
      })
    }
  }, [record, open])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recordData: any = {
        petId: Number(formData.petId),
        appointmentId: formData.appointmentId ? Number(formData.appointmentId) : undefined,
        visit_date: formData.visit_date,
        chiefComplaint: formData.chiefComplaint,
        historyPresentIllness: formData.historyPresentIllness || undefined,
        prognosisNotes: formData.prognosisNotes || undefined,
        veterinarianNotes: formData.veterinarianNotes || undefined,
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
    const date = new Date(appointment.appointmentDate).toLocaleDateString()
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{record ? "Edit Medical Record" : "Create New Medical Record"}</DialogTitle>
          <DialogDescription>
            {record ? "Update the medical record details below." : "Enter the consultation details below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="petId">Mascota *</Label>
            <Select value={formData.petId} onValueChange={(value) => setFormData({ ...formData, petId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a pet" />
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={String(pet.id)}>
                    {pet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appointmentId">Cita relacionada (opcional)</Label>
            <Select
              value={formData.appointmentId}
              onValueChange={(value) => setFormData({ ...formData, appointmentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.petId ? "Selecciona una cita" : "Selecciona primero una mascota."} />
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
            <Label htmlFor="chiefComplaint">Motivo de la visita *</Label>
            <Textarea
              id="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
              rows={2}
              placeholder="Por ejemplo, revisión anual, cojera, vacunación, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="historyPresentIllness">Diagnóstico</Label>
            <Textarea
              id="historyPresentIllness"
              value={formData.historyPresentIllness}
              onChange={(e) => setFormData({ ...formData, historyPresentIllness: e.target.value })}
              rows={2}
              placeholder="Diagnóstico clínico o hallazgos..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prognosisNotes">Tratamiento</Label>
            <Textarea
              id="prognosisNotes"
              value={formData.prognosisNotes}
              onChange={(e) => setFormData({ ...formData, prognosisNotes: e.target.value })}
              rows={3}
              placeholder="Plan de tratamiento, medicamentos, procedimientos, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="veterinarianNotes">Notas adicionales</Label>
            <Textarea
              id="veterinarianNotes"
              value={formData.veterinarianNotes}
              onChange={(e) => setFormData({ ...formData, veterinarianNotes: e.target.value })}
              rows={2}
              placeholder="Cualquier observación o nota adicional..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.petId}>
              {isSubmitting ? "Guardando..." : record ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}