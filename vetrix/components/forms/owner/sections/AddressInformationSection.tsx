import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { FormData, FormHandlers, Option } from "../types/types"

interface AddressInformationSectionProps {
  formData: FormData
  onInputChange: FormHandlers['handleInputChange']
  onSelectChange: FormHandlers['handleSelectChange']
  cities: Option[]
  isLoadingOptions: boolean
}

export function AddressInformationSection({ 
  formData, 
  onInputChange, 
  onSelectChange, 
  cities, 
  isLoadingOptions 
}: AddressInformationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Address Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="addressStreet">Street Address</Label>
          <Input
            id="addressStreet"
            value={formData.addressStreet}
            onChange={(e) => onInputChange('addressStreet', e.target.value)}
            placeholder="Street address, apartment, suite, etc."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cityId">City</Label>
            <Select
              value={formData.cityId}
              onValueChange={(value) => onSelectChange('cityId', value)}
              disabled={isLoadingOptions}
            >
              <SelectTrigger>
                {isLoadingOptions ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading cities...</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Select city" />
                )}
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={String(city.id)}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressPostalCode">Postal Code</Label>
            <Input
              id="addressPostalCode"
              value={formData.addressPostalCode}
              onChange={(e) => onInputChange('addressPostalCode', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}