import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormData, FormHandlers } from "../types/types"

interface BasicInformationSectionProps {
  formData: FormData
  errors: Record<string, string>
  onInputChange: FormHandlers['handleInputChange']
  onPhoneChange: FormHandlers['handlePhoneChange']
}

export function BasicInformationSection({ 
  formData, 
  errors, 
  onInputChange, 
  onPhoneChange 
}: BasicInformationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              required
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && (
              <p id="firstName-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.firstName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              required
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && (
              <p id="lastName-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phonePrimary">Primary Phone</Label>
            <Input
              id="phonePrimary"
              type="tel"
              value={formData.phonePrimary}
              onChange={(e) => onPhoneChange('phonePrimary', e.target.value)}
              placeholder="123-456-7890"
              aria-describedby={errors.phonePrimary ? "phonePrimary-error" : undefined}
              aria-invalid={!!errors.phonePrimary}
            />
            {errors.phonePrimary && (
              <p id="phonePrimary-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.phonePrimary}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneSecondary">Secondary Phone</Label>
            <Input
              id="phoneSecondary"
              type="tel"
              value={formData.phoneSecondary}
              onChange={(e) => onPhoneChange('phoneSecondary', e.target.value)}
              placeholder="123-456-7890"
              aria-describedby={errors.phoneSecondary ? "phoneSecondary-error" : undefined}
              aria-invalid={!!errors.phoneSecondary}
            />
            {errors.phoneSecondary && (
              <p id="phoneSecondary-error" className="text-sm text-red-600 mt-1" role="alert">
                {errors.phoneSecondary}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-600 mt-1" role="alert">
              {errors.email}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}