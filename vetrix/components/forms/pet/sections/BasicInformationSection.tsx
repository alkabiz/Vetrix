"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "../fields/FormField"
import { FormSelect } from "../fields/FormSelect"
import type { BasicInformationSectionProps } from "../types/PetForm.types"
import { createSectionPropsComparator, MEMO_CONFIG } from "../utils/performance-utils"

const BasicInformationSectionComponent: React.FC<BasicInformationSectionProps> = ({
  formData,
  errors,
  owners,
  species,
  breeds,
  colors,
  sexes,
  onFieldChange,
  disabled = false
}) => {
  const handleSpeciesChange = (value: string) => {
    const speciesId = value === "" ? "" : Number(value)
    onFieldChange("speciesId", speciesId)
    
    // Reset breed when species changes
    if (formData.breedId !== "") {
      onFieldChange("breedId", "")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            label="Pet Number *"
            name="petNumber"
            value={formData.petNumber}
            onChange={(value) => onFieldChange("petNumber", value)}
            error={errors.petNumber}
            required
            disabled={disabled}
            aria-required="true"
            aria-invalid={!!errors.petNumber}
            aria-describedby={errors.petNumber ? "petNumber-error" : undefined}
          />
          
          <FormSelect
            label="Owner *"
            name="ownerId"
            value={String(formData.ownerId)}
            onValueChange={(value) => onFieldChange("ownerId", value === "" ? "" : Number(value))}
            options={owners.map(owner => ({
              value: String(owner.id),
              label: `${owner.firstName} ${owner.lastName}`
            }))}
            error={errors.ownerId}
            required
            disabled={disabled}
            placeholder="Select an owner"
            aria-required="true"
            aria-invalid={!!errors.ownerId} onChange={function (): void {
              throw new Error("Function not implemented.")
            } }          />
        </div>

        <FormField
          label="Pet Name *"
          name="name"
          value={formData.name}
          onChange={(value) => onFieldChange("name", value)}
          error={errors.name}
          required
          disabled={disabled}
          placeholder="Enter pet's name"
          maxLength={50}
          aria-required="true"
          aria-invalid={!!errors.name}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormSelect
            label="Species *"
            name="speciesId"
            value={String(formData.speciesId)}
            onValueChange={handleSpeciesChange}
            options={species.map(s => ({
              value: String(s.id),
              label: s.name
            }))}
            error={errors.speciesId}
            required
            disabled={disabled}
            placeholder="Select species"
            aria-required="true"
            aria-invalid={!!errors.speciesId} onChange={function (): void {
              throw new Error("Function not implemented.")
            } }          />

          <FormSelect
            label="Breed"
            name="breedId"
            value={String(formData.breedId)}
            onValueChange={(value) => onFieldChange("breedId", value === "" ? "" : Number(value))}
            options={breeds.map(b => ({
              value: String(b.id),
              label: b.name
            }))}
            error={errors.breedId}
            disabled={!formData.speciesId || disabled}
            placeholder={formData.speciesId ? "Select breed" : "Select species first"}
            aria-invalid={!!errors.breedId} onChange={function (): void {
              throw new Error("Function not implemented.")
            } }          />

          <FormSelect
            label="Sex *"
            name="sexId"
            value={String(formData.sexId)}
            onValueChange={(value) => onFieldChange("sexId", value === "" ? "" : Number(value))}
            options={sexes.map(s => ({
              value: String(s.id),
              label: s.name
            }))}
            error={errors.sexId}
            required
            disabled={disabled}
            placeholder="Select sex"
            aria-required="true"
            aria-invalid={!!errors.sexId} onChange={function (): void {
              throw new Error("Function not implemented.")
            } }          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Primary Color"
            name="primaryColorId"
            value={String(formData.primaryColorId)}
            onValueChange={(value) => onFieldChange("primaryColorId", value === "" ? "" : Number(value))}
            options={colors.map(c => ({
              value: String(c.id),
              label: c.name
            }))}
            error={errors.primaryColorId}
            disabled={disabled}
            placeholder="Select color"
            aria-invalid={!!errors.primaryColorId} onChange={function (): void {
              throw new Error("Function not implemented.")
            } }          />

          <FormSelect
            label="Secondary Color"
            name="secondaryColorId"
            value={String(formData.secondaryColorId)}
            onValueChange={(value) => onFieldChange("secondaryColorId", value === "" ? "" : Number(value))}
            options={colors.map(c => ({
              value: String(c.id),
              label: c.name
            }))}
            error={errors.secondaryColorId}
            disabled={disabled}
            placeholder="Select color"
            aria-invalid={!!errors.secondaryColorId} onChange={function (): void {
              throw new Error("Function not implemented.")
            } }          />
        </div>

        {/* Error summary for the section */}
        {(errors.petNumber || errors.ownerId || errors.name || errors.speciesId || errors.sexId) && (
          <div 
            className="p-3 border border-destructive/20 bg-destructive/10 rounded-md"
            role="alert"
            aria-live="polite"
          >
            <h4 className="text-sm font-medium text-destructive mb-1">
              Please fix the following errors:
            </h4>
            <ul className="text-sm text-destructive list-disc list-inside space-y-1">
              {errors.petNumber && <li id="petNumber-error">Pet Number: {errors.petNumber}</li>}
              {errors.ownerId && <li>Owner: {errors.ownerId}</li>}
              {errors.name && <li>Pet Name: {errors.name}</li>}
              {errors.speciesId && <li>Species: {errors.speciesId}</li>}
              {errors.sexId && <li>Sex: {errors.sexId}</li>}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Memoized with custom comparator that only checks relevant fields
export const BasicInformationSection = React.memo(
  BasicInformationSectionComponent,
  createSectionPropsComparator(MEMO_CONFIG.BASIC_INFO_FIELDS)
)

BasicInformationSection.displayName = "BasicInformationSection"