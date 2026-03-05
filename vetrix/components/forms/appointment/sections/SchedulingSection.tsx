"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SchedulingSectionProps } from "../AppointmentForm.types"
import { APPOINTMENT_FORM_CONFIG, DURATION_OPTIONS } from "../AppointmentForm.types"

export function SchedulingSection({
  formData,
  errors,
  statusOptions = [],
  typeOptions = [],
  priorityOptions = [],
  onFieldChange
}: SchedulingSectionProps) {
  const now = new Date().toISOString().slice(0, 16)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Scheduling</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="appointmentDatetime">Date &amp; Time *</Label>
            <Input
              id="appointmentDatetime"
              type="datetime-local"
              min={APPOINTMENT_FORM_CONFIG.allowPastAppointments ? undefined : now}
              value={formData.appointmentDatetime ?? ""}
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
              value={formData.durationMinutes ? String(formData.durationMinutes) : ""}
              onValueChange={(value) => onFieldChange("durationMinutes", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
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
              value={formData.statusId ? String(formData.statusId) : ""}
              onValueChange={(value) => onFieldChange("statusId", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
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
              value={formData.typeId ? String(formData.typeId) : ""}
              onValueChange={(value) => onFieldChange("typeId", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
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
              value={formData.priorityId ? String(formData.priorityId) : ""}
              onValueChange={(value) => onFieldChange("priorityId", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
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