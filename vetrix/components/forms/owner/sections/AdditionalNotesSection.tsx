import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormData, FormHandlers } from "../types/types"

interface AdditionalNotesSectionProps {
  formData: FormData
  onInputChange: FormHandlers['handleInputChange']
}

export function AdditionalNotesSection({ 
  formData, 
  onInputChange 
}: AdditionalNotesSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Additional Notes</Label>
      <Textarea
        id="notes"
        value={formData.notes}
        onChange={(e) => onInputChange('notes', e.target.value)}
        rows={3}
        placeholder="Any additional notes about the owner..."
      />
    </div>
  )
}