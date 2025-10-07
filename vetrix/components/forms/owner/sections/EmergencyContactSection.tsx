import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormData, FormHandlers } from "../types/types"

interface EmergencyContactSectionProps {
  formData: FormData
  errors: Record<string, string>
  onInputChange: FormHandlers['handleInputChange']
  onPhoneChange: FormHandlers['handlePhoneChange']
}

export function EmergencyContactSection({ 
  formData, 
  errors, 
  onInputChange, 
  onPhoneChange 
}: EmergencyContactSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Emergency Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="emergencyContactName">Contact Name</Label>
          <Input
            id="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={(e) => onInputChange('emergencyContactName', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
            <Input
              id="emergencyContactPhone"
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => onPhoneChange('emergencyContactPhone', e.target.value)}
              placeholder="123-456-7890"
              aria-describedby={errors.emergencyContactPhone ? "emergencyContactPhone-error" : undefined}
              aria-invalid={!!errors.emergencyContactPhone}
            />
            {errors.emergencyContactPhone && (
              <p id="emergencyContactPhone-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.emergencyContactPhone}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyContactRelationship">Relationship</Label>
            <Input
              id="emergencyContactRelationship"
              value={formData.emergencyContactRelationship}
              onChange={(e) => onInputChange('emergencyContactRelationship', e.target.value)}
              placeholder="e.g., Spouse, Parent, Sibling"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}