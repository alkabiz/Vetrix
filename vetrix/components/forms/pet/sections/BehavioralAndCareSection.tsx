"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormTextarea } from "../fields/FormTextarea"
import type { BehavioralAndCareSectionProps } from "../types/PetForm.types"
import { createSectionPropsComparator, MEMO_CONFIG } from "../utils/performance-utils"

const CharacterCounter = ({ value, maxLength }: { value: string; maxLength: number }) => (
  <div className="text-xs text-muted-foreground text-right">
    {value.length}/{maxLength}
  </div>
)

export const BehavioralAndCareSection = React.memo<BehavioralAndCareSectionProps>(
  ({ formData, errors, onFieldChange, disabled = false }) => {
    const MAX_LENGTH = 1000

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Behavioral & Care Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <FormTextarea
              label="Behavioral Notes"
              name="behavioralNotes"
              value={formData.behavioralNotes}
              onChange={(value) => onFieldChange("behavioralNotes", value)}
              error={errors.behavioralNotes}
              placeholder="Temperament, behavioral issues, training notes..."
              maxLength={MAX_LENGTH}
              rows={3}
              disabled={disabled}
              aria-describedby="behavioral-notes-counter"
            />
            <CharacterCounter
              value={formData.behavioralNotes}
              maxLength={MAX_LENGTH}
            />
          </div>

          <div className="space-y-2">
            <FormTextarea
              label="Exercise Requirements"
              name="exerciseRequirements"
              value={formData.exerciseRequirements}
              onChange={(value) => onFieldChange("exerciseRequirements", value)}
              error={errors.exerciseRequirements}
              placeholder="Exercise needs, activity level, restrictions..."
              maxLength={MAX_LENGTH}
              rows={3}
              disabled={disabled}
              aria-describedby="exercise-requirements-counter"
            />
            <CharacterCounter
              value={formData.exerciseRequirements}
              maxLength={MAX_LENGTH}
            />
          </div>

          {errors.behavioralNotes && (
            <p id="behavioral-notes-error" className="text-sm text-destructive" role="alert">
              {errors.behavioralNotes}
            </p>
          )}

          {errors.exerciseRequirements && (
            <p id="exercise-requirements-error" className="text-sm text-destructive" role="alert">
              {errors.exerciseRequirements}
            </p>
          )}
        </CardContent>
      </Card>
    )
  },
  createSectionPropsComparator(MEMO_CONFIG.BEHAVIORAL_FIELDS)
)

BehavioralAndCareSection.displayName = "BehavioralAndCareSection"