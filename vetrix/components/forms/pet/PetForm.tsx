"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

// Import hooks and types
import { usePetForm } from "./hooks/usePetForm"
import { useDynamicOptions } from "./hooks/useDynamicOptions"
import type { PetFormProps } from "./types/PetForm.types"
import { PetFormView } from "./PetFormView"

export function PetForm({
  pet,
  owners = [],
  species = [],
  breeds = [],
  colors = [],
  sexes = [],
  sterilizationTypes = [],
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

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <PetFormView
      pet={pet}
      formData={formData}
      errors={errors}
      isSubmitting={isSubmitting}
      owners={owners}
      speciesOptions={speciesOptions}
      filteredBreeds={filteredBreeds}
      colorOptions={colorOptions}
      sexOptions={sexOptions}
      sterilizationTypeOptions={sterilizationTypeOptions}
      open={open}
      onOpenChange={onOpenChange}
      onFieldChange={handleFieldChange}
      onSubmit={handleFormSubmit}
      onCancel={handleCancel}
    />
  )
}