"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

// Import sections
import { BasicInformationSection } from "./sections/BasicInformationSection"
import { BirthAndAgeSection } from "./sections/BirthAndAgeSection"
import { IdentificationSection } from "./sections/IdentificationSection"
import { MedicalInformationSection } from "./sections/MedicalInformationSection"
import { BehavioralAndCareSection } from "./sections/BehavioralAndCareSection"
import { AcquisitionInformationSection } from "./sections/AcquisitionInformationSection"

// Import hooks and types
import { usePetForm } from "./hooks/usePetForm"
import { useDynamicOptions } from "./hooks/useDynamicOptions"
import type { PetFormProps } from "./types/PetForm.types"
import { PET_FORM_CONFIG } from "../pet/types/form-data.types"

export function PetForm({
  pet,
  owners,
  species,
  breeds,
  colors,
  sexes,
  sterilizationTypes,
  open,
  onOpenChange,
  onSubmit
}: PetFormProps) {
  const { toast } = useToast()

  const {
    formData,
    errors,
    isSubmitting,

    handleFieldChange,
    handleSubmit,
    resetForm,
    validateForm
  } = usePetForm({ pet, onSubmit })

  const {
    speciesOptions,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filteredBreeds,
    colorOptions,
    sexOptions,
    sterilizationTypeOptions
  } = useDynamicOptions({
    species,
    breeds,
    colors,
    sexes,
    sterilizationTypes,
    selectedSpeciesId: formData.speciesId
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      resetForm()
    }
  }, [open, resetForm])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive"
      })
      return
    }

    try {
      await handleSubmit()
      toast({
        title: "Success",
        description: pet ? "Pet updated successfully" : "Pet created successfully",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting pet:", error)
      toast({
        title: "Error",
        description: "Failed to save pet. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {pet ? "Edit Pet" : "Add New Pet"}
          </DialogTitle>
          <DialogDescription>
            {pet
              ? "Update the pet's information below."
              : "Enter the new pet's information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Form Sections */}
          <BasicInformationSection
            formData={{
              petNumber: formData.petNumber,
              ownerId: formData.ownerId,
              name: formData.name,
              speciesId: formData.speciesId,
              breedId: formData.breedId,
              sexId: formData.sexId,
              primaryColorId: formData.primaryColorId,
              secondaryColorId: formData.secondaryColorId,
            }}
            errors={errors}
            owners={owners}
            species={speciesOptions}
            breeds={filteredBreeds}
            colors={colorOptions}
            sexes={sexOptions}
            onFieldChange={handleFieldChange}
          />

          <BirthAndAgeSection
            formData={{
              dateOfBirth: formData.dateOfBirth,
              isBirthEstimated: formData.isBirthEstimated,
            }}
            errors={errors}
            onFieldChange={handleFieldChange}
          />

          <IdentificationSection
            formData={{
              microchipNumber: formData.microchipNumber,
              microchipDate: formData.microchipDate,
              microchipLocation: formData.microchipLocation,
              tattooNumber: formData.tattooNumber,
              registrationNumber: formData.registrationNumber,
            }}
            errors={errors}
            onFieldChange={handleFieldChange}
          />

          <MedicalInformationSection
            formData={{
              isSterilized: formData.isSterilized,
              sterilizationDate: formData.sterilizationDate,
              sterilizationTypeId: formData.sterilizationTypeId,
              specialNeeds: formData.specialNeeds,
              dietaryRestrictions: formData.dietaryRestrictions,
              dateOfDeath: formData.dateOfDeath,
              causeOfDeath: formData.causeOfDeath,
            }}
            errors={errors}
            sterilizationTypes={sterilizationTypeOptions}
            onFieldChange={handleFieldChange}
          />

          <BehavioralAndCareSection
            formData={{
              behavioralNotes: formData.behavioralNotes,
              exerciseRequirements: formData.exerciseRequirements,
            }}
            errors={errors}
            onFieldChange={handleFieldChange}
          />

          <AcquisitionInformationSection
            formData={{
              acquisitionDate: formData.acquisitionDate,
              acquisitionSource: formData.acquisitionSource,
              previousOwnerInfo: formData.previousOwnerInfo,
            }}
            errors={errors}
            onFieldChange={handleFieldChange}
          />

          {/* Status and Submit */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleFieldChange("isActive", e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Active pet
              </label>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving..."
                  : pet ? "Update Pet" : "Create Pet"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}