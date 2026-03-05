"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AppointmentDetailsSectionProps } from "../AppointmentForm.types"
import { APPOINTMENT_FORM_CONFIG } from "../AppointmentForm.types"

export function AppointmentDetailsSection({
  formData,
  errors,
  onFieldChange
}: AppointmentDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Appointment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Visit *</Label>
          <Textarea
            id="reason"
            value={formData.reason ?? ""}
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
            value={formData.petConditionOnArrival ?? ""}
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
                value={formData.estimatedCost ?? ""}
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
                value={formData.actualCost ?? ""}
                onChange={(e) => onFieldChange("actualCost", e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}