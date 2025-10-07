import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FormData, FormHandlers } from "../types/types"

interface SettingsConsentSectionProps {
  formData: FormData
  errors: Record<string, string>
  onInputChange: FormHandlers['handleInputChange']
}

export function SettingsConsentSection({ 
  formData, 
  errors, 
  onInputChange 
}: SettingsConsentSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Settings & Consent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="creditLimit">Credit Limit</Label>
          <Input
            id="creditLimit"
            type="number"
            min="0"
            step="0.01"
            value={formData.creditLimit}
            onChange={(e) => onInputChange('creditLimit', e.target.value)}
            aria-describedby={errors.creditLimit ? "creditLimit-error" : undefined}
            aria-invalid={!!errors.creditLimit}
          />
          {errors.creditLimit && (
            <p id="creditLimit-error" className="text-sm text-red-600 mt-1" role="alert">
              {errors.creditLimit}
            </p>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="marketingConsent"
              checked={formData.marketingConsent}
              onCheckedChange={(checked) => onInputChange('marketingConsent', checked as boolean)}
            />
            <Label htmlFor="marketingConsent">Accepts marketing communications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dataProcessingConsent"
              checked={formData.dataProcessingConsent}
              onCheckedChange={(checked) => onInputChange('dataProcessingConsent', checked as boolean)}
              required
            />
            <Label htmlFor="dataProcessingConsent" className={errors.dataProcessingConsent ? "text-red-600" : ""}>
              Consents to data processing *
            </Label>
          </div>
          {errors.dataProcessingConsent && (
            <p className="text-sm text-red-600 mt-1" role="alert">
              {errors.dataProcessingConsent}
            </p>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => onInputChange('isActive', checked as boolean)}
            />
            <Label htmlFor="isActive">Active client</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}