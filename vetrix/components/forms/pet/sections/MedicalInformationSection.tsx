"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "../fields/FormField"
import { FormDatePicker } from "../fields/FormDatePicker"
import { FormSelect } from "../fields/FormSelect"
import { FormTextarea } from "../fields/FormTextarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { MedicalInformationSectionProps } from "../types/PetForm.types"
import { areSectionPropsEqual } from "../types/section.types"
import { createSectionPropsComparator } from "../utils/performance-utils"

export const MedicalInformationSection = React.memo<MedicalInformationSectionProps>(
  ({ formData, errors, sterilizationTypes, onFieldChange }) => {
    const isSterilized = formData.isSterilized
    const hasDeathDate = !!formData.dateOfDeath

    const validateSterilizationDate = (date: string): boolean => {
      if (!date || !formData.dateOfBirth) return true
      return new Date(date) >= new Date(formData.dateOfBirth)
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medical Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isSterilized"
              checked={isSterilized}
              onCheckedChange={(checked) => 
                onFieldChange("isSterilized", checked as boolean)
              }
              aria-describedby="sterilization-description"
            />
            <Label htmlFor="isSterilized" className="text-sm font-medium">
              Pet is sterilized
            </Label>
          </div>

          {isSterilized && (
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <FormDatePicker
                label="Sterilization Date *"
                name="sterilizationDate"
                value={formData.sterilizationDate}
                onChange={(value) => onFieldChange("sterilizationDate", value)}
                error={errors.sterilizationDate}
                maxDate={new Date().toISOString().split('T')[0]}
                aria-required="true"
                onBlur={() => {
                  if (formData.sterilizationDate && !validateSterilizationDate(formData.sterilizationDate)) {
                    // Error handled by main validation
                  }
                }}
              />

              <FormSelect
                label="Sterilization Type *"
                name="sterilizationTypeId"
                value={String(formData.sterilizationTypeId)}
                onValueChange={(value) => onFieldChange("sterilizationTypeId", value === "" ? "" : Number(value))}
                options={sterilizationTypes.map(st => ({
                  value: String(st.id),
                  label: st.description
                }))}
                error={errors.sterilizationTypeId}
                required
                placeholder="Select type"
                aria-required="true" onChange={function (value: string): void {
                  throw new Error("Function not implemented.")
                } }              />
            </div>
          )}

          <FormTextarea
            label="Special Needs"
            name="specialNeeds"
            value={formData.specialNeeds}
            onChange={(value) => onFieldChange("specialNeeds", value)}
            error={errors.specialNeeds}
            placeholder="Any special medical needs or conditions..."
            maxLength={1000}
            rows={2}
          />

          <FormTextarea
            label="Dietary Restrictions"
            name="dietaryRestrictions"
            value={formData.dietaryRestrictions}
            onChange={(value) => onFieldChange("dietaryRestrictions", value)}
            error={errors.dietaryRestrictions}
            placeholder="Food allergies, special diet requirements..."
            maxLength={1000}
            rows={2}
          />

          {hasDeathDate && (
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <FormDatePicker
                label="Date of Death"
                name="dateOfDeath"
                value={formData.dateOfDeath}
                onChange={(value) => onFieldChange("dateOfDeath", value)}
                error={errors.dateOfDeath}
                maxDate={new Date().toISOString().split('T')[0]}
              />

              <FormField
                label="Cause of Death *"
                name="causeOfDeath"
                value={formData.causeOfDeath}
                onChange={(value) => onFieldChange("causeOfDeath", value)}
                error={errors.causeOfDeath}
                placeholder="Reason for death"
                maxLength={500}
                aria-required="true"
              />
            </div>
          )}

          {isSterilized && formData.sterilizationDate && formData.dateOfBirth && 
           !validateSterilizationDate(formData.sterilizationDate) && (
            <p className="text-sm text-destructive" role="alert">
              Sterilization date cannot be earlier than date of birth
            </p>
          )}

          {hasDeathDate && !formData.causeOfDeath && (
            <p className="text-sm text-destructive" role="alert">
              Cause of death is required when date of death is provided
            </p>
          )}
        </CardContent>
      </Card>
    )
  },
  createSectionPropsComparator([
    "isSterilized",
    "sterilizationDate",
    "sterilizationTypeId",
    "specialNeeds",
    "dietaryRestrictions",
    "dateOfDeath",
    "causeOfDeath"
  ])
)

MedicalInformationSection.displayName = "MedicalInformationSection"