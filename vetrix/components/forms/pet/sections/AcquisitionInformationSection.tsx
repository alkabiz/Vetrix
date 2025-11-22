```typescript
"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "../fields/FormField"
import { FormDatePicker } from "../fields/FormDatePicker"
import { FormTextarea } from "../fields/FormTextarea"
import type { AcquisitionInformationSectionProps } from "../types/PetForm.types"
import { createSectionPropsComparator, MEMO_CONFIG } from "../utils/performance-utils"

export const AcquisitionInformationSection = React.memo<AcquisitionInformationSectionProps>(
  ({ formData, errors, onFieldChange, disabled = false }) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acquisition Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormDatePicker
              label="Acquisition Date"
              name="acquisitionDate"
              value={formData.acquisitionDate}
              onChange={(value) => onFieldChange("acquisitionDate", value)}
              error={errors.acquisitionDate}
              maxDate={new Date().toISOString().split('T')[0]}
              disabled={disabled}
            />

            <FormField
              label="Acquisition Source"
              name="acquisitionSource"
              value={formData.acquisitionSource}
              onChange={(value) => onFieldChange("acquisitionSource", value)}
              error={errors.acquisitionSource}
              placeholder="e.g., Breeder, Shelter, Rescue, Private"
              maxLength={100}
              disabled={disabled}
            />
          </div>

          <FormTextarea
            label="Previous Owner Information"
            name="previousOwnerInfo"
            value={formData.previousOwnerInfo}
            onChange={(value) => onFieldChange("previousOwnerInfo", value)}
            error={errors.previousOwnerInfo}
            placeholder="Information about previous owners, if applicable..."
            maxLength={1000}
            rows={3}
            disabled={disabled}
          />

          {formData.acquisitionDate && (
            <p className="text-xs text-muted-foreground">
              Pet was acquired on {new Date(formData.acquisitionDate).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>
    )
  },
  createSectionPropsComparator(MEMO_CONFIG.ACQUISITION_FIELDS)
)

AcquisitionInformationSection.displayName = "AcquisitionInformationSection"
```