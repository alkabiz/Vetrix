"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "../fields/FormField"
import { FormDatePicker } from "../fields/FormDatePicker"
import type { IdentificationSectionProps } from "../types/PetForm.types"
import { createSectionPropsComparator, MEMO_CONFIG } from "../utils/performance-utils"
import { useMicrochipValidation } from "../hooks/useDebouncedValidation"
import { Loader2 } from "lucide-react"

const IdentificationSectionComponent: React.FC<IdentificationSectionProps> = ({
  formData,
  errors,
  onFieldChange,
  disabled = false
}) => {
  const hasMicrochip = !!formData.microchipNumber?.trim()
  
  const { error: microchipValidationError, isValidating: isMicrochipValidating } = 
    useMicrochipValidation(formData.microchipNumber)

  const handleMicrochipNumberChange = (value: string) => {
    const formattedValue = value.replace(/\s/g, '').toUpperCase()
    onFieldChange("microchipNumber", formattedValue)
  }

  const combinedMicrochipError = errors.microchipNumber || microchipValidationError

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Identification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormField
              label="Microchip Number"
              name="microchipNumber"
              value={formData.microchipNumber}
              onChange={handleMicrochipNumberChange}
              error={combinedMicrochipError ?? undefined}
              placeholder="15-digit hexadecimal code"
              maxLength={15}
              disabled={disabled}
              aria-describedby="microchip-format"
              suffix={
                isMicrochipValidating ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : null
              }
            />
          </div>

          <FormDatePicker
            label="Microchip Date"
            name="microchipDate"
            value={formData.microchipDate}
            onChange={(value) => onFieldChange("microchipDate", value)}
            error={errors.microchipDate}
            disabled={!hasMicrochip || disabled}
            aria-required={hasMicrochip ? "true" : "false"}
            placeholder={hasMicrochip ? "Select date" : "Enter microchip number first"}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Microchip Location"
            name="microchipLocation"
            value={formData.microchipLocation}
            onChange={(value) => onFieldChange("microchipLocation", value)}
            error={errors.microchipLocation}
            placeholder="e.g., Left shoulder, between shoulder blades"
            maxLength={100}
            disabled={disabled}
          />

          <FormField
            label="Tattoo Number"
            name="tattooNumber"
            value={formData.tattooNumber}
            onChange={(value) => onFieldChange("tattooNumber", value)}
            error={errors.tattooNumber}
            maxLength={50}
            disabled={disabled}
          />
        </div>

        <FormField
          label="Registration Number"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={(value) => onFieldChange("registrationNumber", value)}
          error={errors.registrationNumber}
          placeholder="Breed registry or kennel club number"
          maxLength={50}
          disabled={disabled}
        />

        {hasMicrochip && (
          <div 
            id="microchip-format"
            className="text-xs text-muted-foreground"
          >
            Microchip format: 15-digit hexadecimal (ISO 11784/11785)
          </div>
        )}

        {hasMicrochip && !formData.microchipDate && (
          <div className="p-3 border border-amber-200 bg-amber-50 rounded-md">
            <p className="text-sm text-amber-800">
              Microchip date is required when microchip number is provided
            </p>
          </div>
        )}

        {isMicrochipValidating && (
          <div className="p-3 border border-blue-200 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Validating microchip number...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export const IdentificationSection = React.memo(
  IdentificationSectionComponent,
  createSectionPropsComparator(MEMO_CONFIG.IDENTIFICATION_FIELDS)
)

IdentificationSection.displayName = "IdentificationSection"