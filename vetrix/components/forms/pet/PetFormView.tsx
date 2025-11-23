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
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Form Sections */}
                    <BasicInformationSection
                        formData={formData}
                        errors={errors}
                        owners={owners}
                        species={speciesOptions as any}
                        breeds={filteredBreeds as any}
                        colors={colorOptions as any}
                        sexes={sexOptions as any}
                        onFieldChange={onFieldChange as any}
                    />

                    <BirthAndAgeSection
                        formData={formData}
                        errors={errors}
                        onFieldChange={onFieldChange as any}
                    />

                    <IdentificationSection
                        formData={formData}
                        errors={errors}
                        onFieldChange={onFieldChange as any}
                    />

                    <MedicalInformationSection
                        formData={formData}
                        errors={errors}
                        sterilizationTypes={sterilizationTypeOptions as any}
                        onFieldChange={onFieldChange as any}
                    />

                    <BehavioralAndCareSection
                        formData={formData}
                        errors={errors}
                        onFieldChange={onFieldChange as any}
                    />

                    <AcquisitionInformationSection
                        formData={formData}
                        errors={errors}
                        onFieldChange={onFieldChange as any}
                    />

                    {/* Status and Submit */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
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
        </Dialog>
    )
}

export const PetFormView = React.memo(PetFormViewComponent, shallowCompareProps)

PetFormView.displayName = "PetFormView"
