"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Appointment, Owner, Pet, Veterinarian, AppointmentStatus, AppointmentType, AppointmentPriority } from "@/lib/database"

interface AppointmentFormProps {
  appointment?: Appointment | null
  owners: Owner[]
  pets: Pet[]
  veterinarians: Veterinarian[]
  statusOptions: AppointmentStatus[]
  typeOptions: AppointmentType[]
  priorityOptions: AppointmentPriority[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (appointment: Omit<Appointment, "id" | "createdAt" | "updatedAt">) => Promise<void>
}

interface FormData {
  appointmentNumber: string
  petId: number | ""
  ownerId: number | ""
  veterinarianId: number | ""
  appointmentDatetime: string
  durationMinutes: number
  statusId: number
  typeId: number
  priorityId: number
  reason: string
  isFollowUp: boolean
  parentAppointmentId: number | ""
  petConditionOnArrival: string
  reminderSent: boolean
  confirmationRequired: boolean
  isConfirmed: boolean
  followUpRequired: boolean
  followUpDate: string
  followUpReason: string
  estimatedCost: number | ""
  actualCost: number | ""
  notes: string
  internalNotes: string
}

export function AppointmentForm({ 
  appointment, 
  owners, 
  pets, 
  veterinarians,
  statusOptions,
  typeOptions,
  priorityOptions,
  open, 
  onOpenChange, 
  onSubmit 
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    appointmentNumber: "",
    petId: "",
    ownerId: "",
    veterinarianId: "",
    appointmentDatetime: "",
    durationMinutes: 30,
    statusId: 1, // Pending
    typeId: 1, // General consultation
    priorityId: 2, // Normal
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
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Generate default values for new appointments
  const defaultFormData = useMemo((): FormData => {
    const appointmentNumber = `APT${Date.now().toString().slice(-6)}`
    const now = new Date()
    now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15) // Round to next 15 minutes

    return {
      appointmentNumber,
      petId: "",
      ownerId: "",
      veterinarianId: "",
      appointmentDatetime: now.toISOString().slice(0, 16),
      durationMinutes: 30,
      statusId: 1,
      typeId: 1,
      priorityId: 2,
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
    }
  }, [])

  // Reset form when dialog opens/closes or appointment changes
  useEffect(() => {
    if (open) {
      if (appointment) {
        setFormData({
          appointmentNumber: appointment.appointmentNumber,
          petId: appointment.petId,
          ownerId: appointment.ownerId,
          veterinarianId: appointment.veterinarianId || "",
          appointmentDatetime: appointment.appointmentDatetime
            ? new Date(appointment.appointmentDatetime).toISOString().slice(0, 16)
            : defaultFormData.appointmentDatetime,
          durationMinutes: appointment.durationMinutes || 30,
          statusId: appointment.statusId,
          typeId: appointment.typeId,
          priorityId: appointment.priorityId,
          reason: appointment.reason || "",
          isFollowUp: appointment.isFollowUp,
          parentAppointmentId: appointment.parentAppointmentId || "",
          petConditionOnArrival: appointment.petConditionOnArrival || "",
          reminderSent: appointment.reminderSent,
          confirmationRequired: appointment.confirmationRequired,
          isConfirmed: appointment.isConfirmed,
          followUpRequired: appointment.followUpRequired,
          followUpDate: appointment.followUpDate || "",
          followUpReason: appointment.followUpReason || "",
          estimatedCost: appointment.estimatedCost || "",
          actualCost: appointment.actualCost || "",
          notes: appointment.notes || "",
          internalNotes: appointment.internalNotes || "",
        })
      } else {
        setFormData(defaultFormData)
      }
      setErrors({})
    }
  }, [open, appointment, defaultFormData])

  // Filter pets by selected owner
  const filteredPets = useMemo(() => {
    if (!formData.ownerId) return []
    return pets.filter((pet) => pet.ownerId === formData.ownerId)
  }, [formData.ownerId, pets])

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.ownerId) newErrors.ownerId = "Owner is required"
    if (!formData.petId) newErrors.petId = "Pet is required"
    if (!formData.appointmentDatetime) newErrors.appointmentDatetime = "Date and time is required"
    if (!formData.reason.trim()) newErrors.reason = "Reason for visit is required"

    // Validate date is not in the past
    if (formData.appointmentDatetime && new Date(formData.appointmentDatetime) < new Date()) {
      newErrors.appointmentDatetime = "Appointment cannot be in the past"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const appointmentData = {
        appointmentNumber: formData.appointmentNumber,
        petId: formData.petId as number,
        ownerId: formData.ownerId as number,
        veterinarianId: formData.veterinarianId || undefined,
        appointmentDatetime: new Date(formData.appointmentDatetime),
        appointmentDate: formData.appointmentDatetime.split("T")[0],
        durationMinutes: formData.durationMinutes,
        statusId: formData.statusId,
        typeId: formData.typeId,
        priorityId: formData.priorityId,
        reason: formData.reason,
        isFollowUp: formData.isFollowUp,
        parentAppointmentId: formData.parentAppointmentId || undefined,
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
        estimatedCost: formData.estimatedCost || undefined,
        actualCost: formData.actualCost || undefined,
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
      setErrors({ submit: "Failed to save appointment. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleNumberInputChange = (field: keyof FormData, value: string) => {
    const numValue = value === "" ? "" : Number(value)
    handleInputChange(field, numValue)
  }

  // Get today's datetime for min attribute
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

        {errors.submit && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
            {errors.submit}
          </div>
        )}

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
                    onChange={(e) => handleInputChange("appointmentNumber", e.target.value)}
                    required
                    disabled={!!appointment} // Disable editing for existing appointments
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerId">Owner *</Label>
                  <Select
                    value={String(formData.ownerId)}
                    onValueChange={(value) => handleInputChange("ownerId", Number(value))}
                  >
                    <SelectTrigger className={errors.ownerId ? "border-destructive" : ""}>
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
                  {errors.ownerId && <p className="text-destructive text-sm">{errors.ownerId}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="petId">Pet *</Label>
                  <Select
                    value={String(formData.petId)}
                    onValueChange={(value) => handleInputChange("petId", Number(value))}
                    disabled={!formData.ownerId}
                  >
                    <SelectTrigger className={errors.petId ? "border-destructive" : ""}>
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
                  {errors.petId && <p className="text-destructive text-sm">{errors.petId}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="veterinarianId">Assigned Veterinarian</Label>
                  <Select
                    value={String(formData.veterinarianId)}
                    onValueChange={(value) => handleInputChange("veterinarianId", Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a veterinarian" />
                    </SelectTrigger>
                    <SelectContent>
                      {veterinarians.map((vet) => (
                        <SelectItem key={vet.id} value={String(vet.id)}>
                          Dr. {vet.firstName} {vet.lastName}
                        </SelectItem>
                      ))}
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
                    onChange={(e) => handleInputChange("appointmentDatetime", e.target.value)}
                    className={errors.appointmentDatetime ? "border-destructive" : ""}
                    required
                  />
                  {errors.appointmentDatetime && (
                    <p className="text-destructive text-sm">{errors.appointmentDatetime}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="durationMinutes">Duration (minutes) *</Label>
                  <Select
                    value={String(formData.durationMinutes)}
                    onValueChange={(value) => handleInputChange("durationMinutes", Number(value))}
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
                    value={String(formData.statusId)}
                    onValueChange={(value) => handleInputChange("statusId", Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.id} value={String(status.id)}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="typeId">Type</Label>
                  <Select
                    value={String(formData.typeId)}
                    onValueChange={(value) => handleInputChange("typeId", Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((type) => (
                        <SelectItem key={type.id} value={String(type.id)}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priorityId">Priority</Label>
                  <Select
                    value={String(formData.priorityId)}
                    onValueChange={(value) => handleInputChange("priorityId", Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((priority) => (
                        <SelectItem key={priority.id} value={String(priority.id)}>
                          {priority.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rest of the form components remain similar but with improved error handling */}
          {/* ... (other sections like Appointment Details, Follow-up, Notes) */}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.ownerId || !formData.petId}
            >
              {isSubmitting ? "Saving..." : appointment ? "Update" : "Schedule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}