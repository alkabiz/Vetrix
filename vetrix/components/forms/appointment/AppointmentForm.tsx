"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Import section components
import { BasicInformationSection } from "./sections/BasicInformationSection"
import { SchedulingSection } from "./sections/SchedulingSection"
import { AppointmentDetailsSection } from "./sections/AppointmentDetailsSection"
import { FollowUpSection } from "./sections/FollowUpSection"
import { NotesSection } from "./sections/NotesSection"

import type { AppointmentFormProps, AppointmentFormData, AppointmentFormErrors } from "./AppointmentForm.types"
import { DEFAULT_APPOINTMENT_FORM_VALUES, APPOINTMENT_FORM_CONFIG } from "./AppointmentForm.types"

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
  const [formData, setFormData] = useState<AppointmentFormData>(DEFAULT_APPOINTMENT_FORM_VALUES)
  const [errors, setErrors] = useState<AppointmentFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Generate default form data for new appointments
  const defaultFormData = useMemo((): AppointmentFormData => {
    const appointmentNumber = APPOINTMENT_FORM_CONFIG.autoGenerateAppointmentNumber 
      ? `APT${Date.now().toString().slice(-6)}`
      : ""

    const now = new Date()
    now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15) // Round to next 15 minutes

    return {
      ...DEFAULT_APPOINTMENT_FORM_VALUES,
      appointmentNumber,
      appointmentDatetime: now.toISOString().slice(0, 16),
    }
  }, [])

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (appointment) {
        // Edit mode - populate with existing appointment data
        setFormData({
          appointmentNumber: appointment.appointmentNumber,
          petId: appointment.petId,
          ownerId: appointment.ownerId,
          veterinarianId: appointment.veterinarianId || "",
          appointmentDatetime: appointment.appointmentDatetime
            ? new Date(appointment.appointmentDatetime).toISOString().slice(0, 16)
            : defaultFormData.appointmentDatetime,
          durationMinutes: appointment.durationMinutes || APPOINTMENT_FORM_CONFIG.defaultDuration,
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
        // Create mode - use default values
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

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: AppointmentFormErrors = {}

    // Required fields validation
    if (!formData.appointmentNumber.trim()) {
      newErrors.appointmentNumber = "Appointment number is required"
    }

    if (!formData.ownerId) {
      newErrors.ownerId = "Owner is required"
    }

    if (!formData.petId) {
      newErrors.petId = "Pet is required"
    }

    if (!formData.appointmentDatetime) {
      newErrors.appointmentDatetime = "Date and time is required"
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason for visit is required"
    }

    // Business logic validation
    if (formData.appointmentDatetime && !APPOINTMENT_FORM_CONFIG.allowPastAppointments) {
      const appointmentDate = new Date(formData.appointmentDatetime)
      if (appointmentDate < new Date()) {
        newErrors.appointmentDatetime = "Appointment cannot be in the past"
      }
    }

    if (formData.durationMinutes < APPOINTMENT_FORM_CONFIG.minDuration || 
        formData.durationMinutes > APPOINTMENT_FORM_CONFIG.maxDuration) {
      newErrors.durationMinutes = `Duration must be between ${APPOINTMENT_FORM_CONFIG.minDuration} and ${APPOINTMENT_FORM_CONFIG.maxDuration} minutes`
    }

    if (APPOINTMENT_FORM_CONFIG.requireVeterinarianAssignment && !formData.veterinarianId) {
      newErrors.veterinarianId = "Veterinarian assignment is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  // Handle field changes
  const handleFieldChange = useCallback(<K extends keyof AppointmentFormData>(
    field: K,
    value: AppointmentFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive"
      })
      return
    }

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
      
      toast({
        title: "Success",
        description: appointment 
          ? "Appointment updated successfully" 
          : "Appointment scheduled successfully",
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting appointment:", error)
      toast({
        title: "Error",
        description: "Failed to save appointment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Edit Appointment" : "Schedule New Appointment"}
          </DialogTitle>
          <DialogDescription>
            {appointment 
              ? "Update the appointment details below." 
              : "Enter the appointment information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInformationSection
            formData={formData}
            errors={errors}
            owners={owners}
            veterinarians={veterinarians}
            filteredPets={filteredPets}
            onFieldChange={handleFieldChange} pets={[]}          />

          <SchedulingSection
            formData={formData}
            errors={errors}
            statusOptions={statusOptions}
            typeOptions={typeOptions}
            priorityOptions={priorityOptions}
            onFieldChange={handleFieldChange}
          />

          <AppointmentDetailsSection
            formData={formData}
            errors={errors}
            onFieldChange={handleFieldChange}
          />

          <FollowUpSection
            formData={formData}
            onFieldChange={handleFieldChange}
          />

          <NotesSection
            formData={formData}
            onFieldChange={handleFieldChange}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? "Saving..." 
                : appointment ? "Update Appointment" : "Schedule Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}