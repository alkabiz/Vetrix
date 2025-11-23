"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BasicInformationSection } from "./sections/BasicInformationSection"
import { BirthAndAgeSection } from "./sections/BirthAndAgeSection"
import { IdentificationSection } from "./sections/IdentificationSection"
import { MedicalInformationSection } from "./sections/MedicalInformationSection"
import { BehavioralAndCareSection } from "./sections/BehavioralAndCareSection"
import { AcquisitionInformationSection } from "./sections/AcquisitionInformationSection"
import type { PetFormViewProps } from "./types/PetForm.types"
import { shallowCompareProps } from "./utils/performance-utils"

const PetFormViewComponent: React.FC<PetFormViewProps> = ({
    pet,
    formData,
    errors,
    isSubmitting,
    owners,
    speciesOptions,
    filteredBreeds,
    colorOptions,
    sexOptions,
    sterilizationTypeOptions,
    open,
    onOpenChange,
    onFieldChange,
    onSubmit,
    onCancel
}) => {
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
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => onFieldChange("isActive", e.target.checked)}
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
                            onClick={onCancel}
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
        </Dialog >
    )
}

// Memoize the view component to prevent unnecessary re-renders
// We use shallow comparison for props as most are primitives or stable references
export const PetFormView = React.memo(PetFormViewComponent, shallowCompareProps)

PetFormView.displayName = "PetFormView"
