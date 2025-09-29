"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

import type {
  AppointmentFormProps,
  AppointmentFormData,
  AppointmentFormErrors,
  BasicInformationSectionProps,
  SchedulingSectionProps,
  AppointmentDetailsSectionProps,
  FollowUpSectionProps,
  NotesSectionProps
} from "../lib/AppointmentForm.types"
import {
  DEFAULT_APPOINTMENT_FORM_VALUES,
  DURATION_OPTIONS,
  APPOINTMENT_FORM_CONFIG
} from "../lib/AppointmentForm.types"

// Sub-components for better organization
const BasicInformationSection = ({
  formData,
  errors,
  owners,
  //pets,
  veterinarians,
  filteredPets,
  onFieldChange
}: BasicInformationSectionProps) => (
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
            onChange={(e) => onFieldChange("appointmentNumber", e.target.value)}
            required
            className={errors.appointmentNumber ? "border-destructive" : ""}
          />
          {errors.appointmentNumber && (
            <p className="text-destructive text-sm">{errors.appointmentNumber}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ownerId">Owner *</Label>
          <Select
            value={String(formData.ownerId)}
            onValueChange={(value) => onFieldChange("ownerId", value === "" ? "" : Number(value))}
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
            onValueChange={(value) => onFieldChange("petId", value === "" ? "" : Number(value))}
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
            onValueChange={(value) => onFieldChange("veterinarianId", value === "" ? "" : Number(value))}
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
)

const SchedulingSection = ({
  formData,
  errors,
  statusOptions,
  typeOptions,
  priorityOptions,
  onFieldChange
}: SchedulingSectionProps) => {
  const now = new Date().toISOString().slice(0, 16)
  
  return (
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
              min={APPOINTMENT_FORM_CONFIG.allowPastAppointments ? undefined : now}
              value={formData.appointmentDatetime}
              onChange={(e) => onFieldChange("appointmentDatetime", e.target.value)}
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
              onValueChange={(value) => onFieldChange("durationMinutes", Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="statusId">Status</Label>
            <Select
              value={String(formData.statusId)}
              onValueChange={(value) => onFieldChange("statusId", Number(value))}
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
              onValueChange={(value) => onFieldChange("typeId", Number(value))}
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
              onValueChange={(value) => onFieldChange("priorityId", Number(value))}
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
  )
}

const AppointmentDetailsSection = ({
  formData,
  errors,
  onFieldChange
}: AppointmentDetailsSectionProps) => (
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
          onChange={(e) => onFieldChange("reason", e.target.value)}
          rows={2}
          placeholder="Describe the reason for this appointment..."
          className={errors.reason ? "border-destructive" : ""}
          required
        />
        {errors.reason && <p className="text-destructive text-sm">{errors.reason}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="petConditionOnArrival">Pet Condition on Arrival</Label>
        <Textarea
          id="petConditionOnArrival"
          value={formData.petConditionOnArrival}
          onChange={(e) => onFieldChange("petConditionOnArrival", e.target.value)}
          rows={2}
          placeholder="Describe the pet's condition when they arrive..."
        />
      </div>
      
      {APPOINTMENT_FORM_CONFIG.enableCostTracking && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="estimatedCost">Estimated Cost</Label>
            <Input
              id="estimatedCost"
              type="number"
              min="0"
              step="0.01"
              value={formData.estimatedCost}
              onChange={(e) => onFieldChange("estimatedCost", e.target.value === "" ? "" : Number(e.target.value))}
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
              onChange={(e) => onFieldChange("actualCost", e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="0.00"
            />
          </div>
        </div>
      )}
    </CardContent>
  </Card>
)

const FollowUpSection = ({
  formData,
  onFieldChange
}: FollowUpSectionProps) => (
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
            onCheckedChange={(checked) => onFieldChange("isFollowUp", checked as boolean)}
          />
          <Label htmlFor="isFollowUp">This is a follow-up appointment</Label>
        </div>
        
        {APPOINTMENT_FORM_CONFIG.enableReminderSystem && (
          <>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="confirmationRequired"
                checked={formData.confirmationRequired}
                onCheckedChange={(checked) => onFieldChange("confirmationRequired", checked as boolean)}
              />
              <Label htmlFor="confirmationRequired">Confirmation required</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isConfirmed"
                checked={formData.isConfirmed}
                onCheckedChange={(checked) => onFieldChange("isConfirmed", checked as boolean)}
              />
              <Label htmlFor="isConfirmed">Appointment confirmed</Label>
            </div>
          </>
        )}
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="followUpRequired"
            checked={formData.followUpRequired}
            onCheckedChange={(checked) => onFieldChange("followUpRequired", checked as boolean)}
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
              onChange={(e) => onFieldChange("followUpDate", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="followUpReason">Follow-up Reason</Label>
            <Input
              id="followUpReason"
              value={formData.followUpReason}
              onChange={(e) => onFieldChange("followUpReason", e.target.value)}
              placeholder="Reason for follow-up"
            />
          </div>
        </div>
      )}
    </CardContent>
  </Card>
)

const NotesSection = ({
  formData,
  onFieldChange
}: NotesSectionProps) => (
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
          onChange={(e) => onFieldChange("notes", e.target.value)}
          rows={2}
          placeholder="Notes visible to staff and clients..."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="internalNotes">Internal Notes</Label>
        <Textarea
          id="internalNotes"
          value={formData.internalNotes}
          onChange={(e) => onFieldChange("internalNotes", e.target.value)}
          rows={2}
          placeholder="Internal notes for staff only..."
        />
      </div>
    </CardContent>
  </Card>
)

// Main component
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
            pets={pets}
            veterinarians={veterinarians}
            filteredPets={filteredPets}
            onFieldChange={handleFieldChange}
          />

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