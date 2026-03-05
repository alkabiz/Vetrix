"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FollowUpSectionProps } from "../AppointmentForm.types"
import { APPOINTMENT_FORM_CONFIG } from "../AppointmentForm.types"

export function FollowUpSection({
  formData,
  onFieldChange
}: FollowUpSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Follow-up &amp; Reminders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFollowUp"
              checked={formData.isFollowUp ?? false}
              onCheckedChange={(checked) => onFieldChange("isFollowUp", checked as boolean)}
            />
            <Label htmlFor="isFollowUp">This is a follow-up appointment</Label>
          </div>
          
          {APPOINTMENT_FORM_CONFIG.enableReminderSystem && (
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirmationRequired"
                  checked={formData.confirmationRequired ?? false}
                  onCheckedChange={(checked) => onFieldChange("confirmationRequired", checked as boolean)}
                />
                <Label htmlFor="confirmationRequired">Confirmation required</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isConfirmed"
                  checked={formData.isConfirmed ?? false}
                  onCheckedChange={(checked) => onFieldChange("isConfirmed", checked as boolean)}
                />
                <Label htmlFor="isConfirmed">Appointment confirmed</Label>
              </div>
            </>
          )}
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="followUpRequired"
              checked={formData.followUpRequired ?? false}
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
                value={formData.followUpDate ?? ""}
                onChange={(e) => onFieldChange("followUpDate", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="followUpReason">Follow-up Reason</Label>
              <Input
                id="followUpReason"
                value={formData.followUpReason ?? ""}
                onChange={(e) => onFieldChange("followUpReason", e.target.value)}
                placeholder="Reason for follow-up"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}