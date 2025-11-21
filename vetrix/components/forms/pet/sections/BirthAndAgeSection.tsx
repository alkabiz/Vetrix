"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormDatePicker } from "../fields/FormDatePicker"
import { FormCheckbox } from "../fields/FormCheckbox"
import type { BirthAndAgeSectionProps } from "../types/PetForm.types"
import { createSectionPropsComparator, MEMO_CONFIG } from "../utils/performance-utils"
import { calculateAgeString, isValidPastDate } from "../utils/date-utils"

const BirthAndAgeSectionComponent: React.FC<BirthAndAgeSectionProps> = ({
  formData,
  errors,
  onFieldChange,
  disabled = false
}) => {
  const hasBirthDate = !!formData.dateOfBirth
  const calculatedAge = formData.dateOfBirth && isValidPastDate(new Date(formData.dateOfBirth))
    ? calculateAgeString(new Date(formData.dateOfBirth))
    : null

  const handleBirthDateChange = (value: string) => {
    onFieldChange("dateOfBirth", value)
    
    // If setting a birth date, uncheck estimated if it was checked
    if (value && formData.isBirthEstimated) {
      onFieldChange("isBirthEstimated", false)
    }
  }

  const handleEstimatedChange = (checked: boolean) => {
    onFieldChange("isBirthEstimated", checked)
    
    // If marking as estimated and there's a birth date, clear it
    if (checked && formData.dateOfBirth) {
      onFieldChange("dateOfBirth", "")
    }
  }

  const showValidationError = !hasBirthDate && !formData.isBirthEstimated
  const showAgeWarning = formData.dateOfBirth && !isValidPastDate(new Date(formData.dateOfBirth))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Birth & Age Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <FormDatePicker
              label="Date of Birth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleBirthDateChange}
              error={errors.dateOfBirth}
              disabled={disabled || formData.isBirthEstimated}
              maxDate={new Date().toISOString().split('T')[0]}
              placeholder="Select birth date"
              allowClear={true}
              showCalendar={true}
              aria-describedby={
                errors.dateOfBirth 
                  ? "dateOfBirth-error" 
                  : calculatedAge 
                    ? "calculated-age" 
                    : undefined
              }
            />

            {calculatedAge && (
              <div className="p-3 bg-muted/50 rounded-md">
                <p 
                  id="calculated-age"
                  className="text-sm font-medium text-foreground"
                >
                  Calculated age: <span className="text-primary">{calculatedAge}</span>
                </p>
              </div>
            )}

            {showAgeWarning && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="text-sm text-amber-800">
                  Birth date appears to be in the future. Please verify the date.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <FormCheckbox
              label="Birth date is estimated"
              name="isBirthEstimated"
              checked={formData.isBirthEstimated}
              onChange={handleEstimatedChange}
              error={errors.isBirthEstimated}
              disabled={disabled}
              description="Check if the exact birth date is unknown. Age will be recorded as approximate."
              aria-describedby="birth-estimated-description"
            />

            {formData.isBirthEstimated && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  Age will be recorded as approximate since exact date is unknown.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error messages */}
        {errors.dateOfBirth && (
          <div 
            id="dateOfBirth-error" 
            className="p-3 border border-destructive/20 bg-destructive/10 rounded-md"
            role="alert"
          >
            <p className="text-sm text-destructive font-medium">
              {errors.dateOfBirth}
            </p>
          </div>
        )}

        {showValidationError && (
          <div 
            className="p-3 border border-destructive/20 bg-destructive/10 rounded-md"
            role="alert"
          >
            <p className="text-sm text-destructive font-medium">
              Either date of birth must be provided or birth must be marked as estimated
            </p>
          </div>
        )}

        {/* Information message when both are provided */}
        {hasBirthDate && formData.isBirthEstimated && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-sm text-amber-800">
              Both date of birth and estimated flag are set. The estimated flag will be ignored.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Memoized with custom comparator that only checks relevant fields
export const BirthAndAgeSection = React.memo(
  BirthAndAgeSectionComponent,
  createSectionPropsComparator(MEMO_CONFIG.BIRTH_AGE_FIELDS)
)

BirthAndAgeSection.displayName = "BirthAndAgeSection"