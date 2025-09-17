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
import { Checkbox } from "@/components/ui/checkbox"
import type { Appointment, Owner, Pet } from "@/lib/database"

interface AppointmentFormProps {
  appointment?: Appointment | null
  owners: Owner[]
  pets: Pet[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => Promise<void>
}

export function AppointmentForm({ appointment, owners, pets, open, onOpenChange, onSubmit }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    appointmentNumber: "",
    petId: "",
    ownerId: "",
    veterinarianId: "",
    appointmentDatetime: "",
    durationMinutes: "30",
    statusId: "1", // Pending
    typeId: "1", // General consultation
    priorityId: "2", // Normal
    reason: "",
    isFollowUp: false,
    parentAppointmentId: "",
    petConditionOnArrival: "",
    reminderSent: false,
    confirmationRequired: true,
    isConfirmed: false,
    followUpRequired: false,
    followUpDate: "",
    followUpReason: "",
    estimatedCost: "",
    actualCost: "",
    notes: "",
    internalNotes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filteredPets, setFilteredPets] = useState<Pet[]>([])

  useEffect(() => {
    if (appointment) {
      setFormData({
        appointmentNumber: appointment.appointmentNumber || "",
        petId: String(appointment.petId),
        ownerId: String(appointment.ownerId),
        veterinarianId: appointment.veterinarianId ? String(appointment.veterinarianId) : "",
        appointmentDatetime: appointment.appointmentDatetime
          ? new Date(appointment.appointmentDatetime).toISOString().slice(0, 16)
          : "",
        durationMinutes: String(appointment.durationMinutes || 30),
        statusId: String(appointment.statusId),
        typeId: String(appointment.typeId),
        priorityId: String(appointment.priorityId),
        reason: appointment.reason || "",
        isFollowUp: appointment.isFollowUp,
        parentAppointmentId: appointment.parentAppointmentId ? String(appointment.parentAppointmentId) : "",
        petConditionOnArrival: appointment.petConditionOnArrival || "",
        reminderSent: appointment.reminderSent,
        confirmationRequired: appointment.confirmationRequired,
        isConfirmed: appointment.isConfirmed,
        followUpRequired: appointment.followUpRequired,
        followUpDate: appointment.followUpDate || "",
        followUpReason: appointment.followUpReason || "",
        estimatedCost: appointment.estimatedCost ? String(appointment.estimatedCost) : "",
        actualCost: appointment.actualCost ? String(appointment.actualCost) : "",
        notes: appointment.notes || "",
        internalNotes: appointment.internalNotes || "",
      })
    } else {
      // Generate appointment number automatically
      const appointmentNumber = `APT${Date.now().toString().slice(-6)}`
      const now = new Date()
      now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15) // Round to next 15 minutes

      setFormData({
        appointmentNumber,
        petId: "",
        ownerId: "",
        veterinarianId: "",
        appointmentDatetime: now.toISOString().slice(0, 16),
        durationMinutes: "30",
        statusId: "1",
        typeId: "1",
        priorityId: "2",
        reason: "",
        isFollowUp: false,
        parentAppointmentId: "",
        petConditionOnArrival: "",
        reminderSent: false,
        confirmationRequired: true,
        isConfirmed: false,
        followUpRequired: false,
        followUpDate: "",
        followUpReason: "",
        estimatedCost: "",
        actualCost: "",
        notes: "",
        internalNotes: "",
      })
    }
  }, [appointment, open])

  useEffect(() => {
    if (formData.ownerId) {
      const ownerPets = pets.filter((pet) => String(pet.ownerId) === formData.ownerId)
      setFilteredPets(ownerPets)

      // Reset pet selection if current pet doesn't belong to selected owner
      if (formData.petId && !ownerPets.find((pet) => String(pet.id) === formData.petId)) {
        setFormData((prev) => ({ ...prev, petId: "" }))
      }
    } else {
      setFilteredPets([])
      setFormData((prev) => ({ ...prev, petId: "" }))
    }
  }, [formData.ownerId, pets])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const appointmentData = {
        appointmentNumber: formData.appointmentNumber,
        petId: Number(formData.petId),
        ownerId: Number(formData.ownerId),
        veterinarianId: formData.veterinarianId ? Number(formData.veterinarianId) : undefined,
        appointmentDatetime: new Date(formData.appointmentDatetime),
        appointmentDate: formData.appointmentDatetime.split("T")[0],
        durationMinutes: Number(formData.durationMinutes),
        statusId: Number(formData.statusId),
        typeId: Number(formData.typeId),
        priorityId: Number(formData.priorityId),
        reason: formData.reason,
        isFollowUp: formData.isFollowUp,
        parentAppointmentId: formData.parentAppointmentId ? Number(formData.parentAppointmentId) : undefined,
        petConditionOnArrival: formData.petConditionOnArrival || undefined,
        checkInTime: undefined,
        actualStartTime: undefined,
        actualEndTime: undefined,
        waitingTimeMinutes: undefined,
        reminderSent: formData.reminderSent,
        reminderSentAt: undefined,
        confirmationRequired: formData.confirmationRequired,
        isConfirmed: formData.isConfirmed,
        confirmedAt: formData.isConfirmed ? new Date() : undefined,
        followUpRequired: formData.followUpRequired,
        followUpDate: formData.followUpDate || undefined,
        followUpReason: formData.followUpReason || undefined,
        estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : undefined,
        actualCost: formData.actualCost ? Number(formData.actualCost) : undefined,
        cancellationReason: undefined,
        cancelledAt: undefined,
        cancelledBy: undefined,
        rescheduledFromId: undefined,
        notes: formData.notes || undefined,
        internalNotes: formData.internalNotes || undefined,
      }

      await onSubmit(appointmentData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting appointment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get today's datetime in YYYY-MM-DDTHH:MM format for min datetime
  const now = new Date().toISOString().slice(0, 16)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{appointment ? "Edit Appointment" : "Schedule New Appointment"}</DialogTitle>
          <DialogDescription>
            {appointment ? "Update the appointment details below." : "Enter the appointment information below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointmentNumber">Appointment Number *</Label>
                  <Input
                    id="appointmentNumber"
                    value={formData.appointmentNumber}
                    onChange={(e) => setFormData({ ...formData, appointmentNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerId">Owner *</Label>
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="petId">Pet *</Label>
                  <Select
                    value={formData.petId}
                    onValueChange={(value) => setFormData({ ...formData, petId: value })}
                    disabled={!formData.ownerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.ownerId ? "Select a pet" : "Select an owner first"} />
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
                <div className="space-y-2">
                  <Label htmlFor="veterinarianId">Assigned Veterinarian</Label>
                  <Select
                    value={formData.veterinarianId}
                    onValueChange={(value) => setFormData({ ...formData, veterinarianId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a veterinarian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Dr. Anderson</SelectItem>
                      <SelectItem value="2">Dr. Smith</SelectItem>
                      <SelectItem value="3">Dr. Johnson</SelectItem>
                      <SelectItem value="4">Dr. Williams</SelectItem>
                      <SelectItem value="5">Dr. Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scheduling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appointmentDatetime">Date & Time *</Label>
                  <Input
                    id="appointmentDatetime"
                    type="datetime-local"
                    min={now}
                    value={formData.appointmentDatetime}
                    onChange={(e) => setFormData({ ...formData, appointmentDatetime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="durationMinutes">Duration (minutes) *</Label>
                  <Select
                    value={formData.durationMinutes}
                    onValueChange={(value) => setFormData({ ...formData, durationMinutes: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="statusId">Status</Label>
                  <Select
                    value={formData.statusId}
                    onValueChange={(value) => setFormData({ ...formData, statusId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Pending</SelectItem>
                      <SelectItem value="2">Confirmed</SelectItem>
                      <SelectItem value="3">In Progress</SelectItem>
                      <SelectItem value="4">Completed</SelectItem>
                      <SelectItem value="5">Cancelled</SelectItem>
                      <SelectItem value="6">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="typeId">Type</Label>
                  <Select
                    value={formData.typeId}
                    onValueChange={(value) => setFormData({ ...formData, typeId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">General Consultation</SelectItem>
                      <SelectItem value="2">Vaccination</SelectItem>
                      <SelectItem value="3">Surgery</SelectItem>
                      <SelectItem value="4">Emergency</SelectItem>
                      <SelectItem value="5">Follow-up</SelectItem>
                      <SelectItem value="6">Grooming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priorityId">Priority</Label>
                  <Select
                    value={formData.priorityId}
                    onValueChange={(value) => setFormData({ ...formData, priorityId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Low</SelectItem>
                      <SelectItem value="2">Normal</SelectItem>
                      <SelectItem value="3">High</SelectItem>
                      <SelectItem value="4">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit *</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={2}
                  placeholder="Describe the reason for this appointment..."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="petConditionOnArrival">Pet Condition on Arrival</Label>
                <Textarea
                  id="petConditionOnArrival"
                  value={formData.petConditionOnArrival}
                  onChange={(e) => setFormData({ ...formData, petConditionOnArrival: e.target.value })}
                  rows={2}
                  placeholder="Describe the pet's condition when they arrive..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedCost">Estimated Cost</Label>
                  <Input
                    id="estimatedCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualCost">Actual Cost</Label>
                  <Input
                    id="actualCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.actualCost}
                    onChange={(e) => setFormData({ ...formData, actualCost: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Follow-up & Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Follow-up & Reminders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFollowUp"
                    checked={formData.isFollowUp}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFollowUp: checked as boolean })}
                  />
                  <Label htmlFor="isFollowUp">This is a follow-up appointment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="confirmationRequired"
                    checked={formData.confirmationRequired}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, confirmationRequired: checked as boolean })
                    }
                  />
                  <Label htmlFor="confirmationRequired">Confirmation required</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isConfirmed"
                    checked={formData.isConfirmed}
                    onCheckedChange={(checked) => setFormData({ ...formData, isConfirmed: checked as boolean })}
                  />
                  <Label htmlFor="isConfirmed">Appointment confirmed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="followUpRequired"
                    checked={formData.followUpRequired}
                    onCheckedChange={(checked) => setFormData({ ...formData, followUpRequired: checked as boolean })}
                  />
                  <Label htmlFor="followUpRequired">Follow-up required</Label>
                </div>
              </div>
              {formData.followUpRequired && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="followUpDate">Follow-up Date</Label>
                    <Input
                      id="followUpDate"
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="followUpReason">Follow-up Reason</Label>
                    <Input
                      id="followUpReason"
                      value={formData.followUpReason}
                      onChange={(e) => setFormData({ ...formData, followUpReason: e.target.value })}
                      placeholder="Reason for follow-up"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Public Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Notes visible to staff and clients..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="internalNotes">Internal Notes</Label>
                <Textarea
                  id="internalNotes"
                  value={formData.internalNotes}
                  onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                  rows={2}
                  placeholder="Internal notes for staff only..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.ownerId || !formData.petId}>
              {isSubmitting ? "Saving..." : appointment ? "Update" : "Schedule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}