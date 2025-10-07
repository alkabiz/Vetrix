import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { FormData, FormHandlers, Option } from "../types/types"

interface IdentificationSectionProps {
  formData: FormData
  errors: Record<string, string>
  onInputChange: FormHandlers['handleInputChange']
  onSelectChange: FormHandlers['handleSelectChange']
  identificationTypes: Option[]
  isLoadingOptions: boolean
}

export function IdentificationSection({ 
  formData, 
  errors, 
  onInputChange, 
  onSelectChange, 
  identificationTypes, 
  isLoadingOptions 
}: IdentificationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Identification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="identificationTypeId">ID Type</Label>
            <Select
              value={formData.identificationTypeId}
              onValueChange={(value) => onSelectChange('identificationTypeId', value)}
              disabled={isLoadingOptions}
            >
              <SelectTrigger>
                {isLoadingOptions ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading ID types...</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Select ID type" />
                )}
              </SelectTrigger>
              <SelectContent>
                {identificationTypes.map((type) => (
                  <SelectItem key={type.id} value={String(type.id)}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="identificationNumber">ID Number</Label>
            <Input
              id="identificationNumber"
              value={formData.identificationNumber}
              onChange={(e) => onInputChange('identificationNumber', e.target.value)}
              aria-describedby={errors.identificationNumber ? "identificationNumber-error" : undefined}
              aria-invalid={!!errors.identificationNumber}
            />
            {errors.identificationNumber && (
              <p id="identificationNumber-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.identificationNumber}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}