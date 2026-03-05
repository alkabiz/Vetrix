"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { NotesSectionProps } from "../AppointmentForm.types"

export function NotesSection({
  formData,
  onFieldChange
}: NotesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notes">Public Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes ?? ""}
            onChange={(e) => onFieldChange("notes", e.target.value)}
            rows={2}
            placeholder="Notes visible to staff and clients..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="internalNotes">Internal Notes</Label>
          <Textarea
            id="internalNotes"
            value={formData.internalNotes ?? ""}
            onChange={(e) => onFieldChange("internalNotes", e.target.value)}
            rows={2}
            placeholder="Internal notes for staff only..."
          />
        </div>
      </CardContent>
    </Card>
  )
}