"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { useOwnerForm } from "./hooks/useOwnerForm"
import { BasicInformationSection } from "./sections/BasicInformationSection"
import { AddressInformationSection } from "./sections/AddressInformationSection"
import { IdentificationSection } from "./sections/IdentificationSection"
import { EmergencyContactSection } from "./sections/EmergencyContactSection"
import { SettingsConsentSection } from "./sections/SettingsConsentSection"
import { AdditionalNotesSection } from "./sections/AdditionalNotesSection"
import type { OwnerFormProps } from "./types/types"

export function OwnerForm({ owner, open, onOpenChange, onSubmit }: OwnerFormProps) {
  const {
    formData,
    errors,
    isSubmitting,
    submitError,
    cities,
    identificationTypes,
    isLoadingOptions,
    handleInputChange,
    handlePhoneChange,
    handleSelectChange,
    validateForm,
    setErrors,
    setIsSubmitting,
    setSubmitError,
    prepareSubmitData,
  } = useOwnerForm(owner, open)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")
    
    const newErrors = validateForm()
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0]
      const element = document.getElementById(firstErrorField)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      element?.focus()
      return
    }

    setIsSubmitting(true)

    try {
      const ownerData = prepareSubmitData()
      await onSubmit(ownerData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting owner:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to save owner. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{owner ? "Edit Owner" : "Add New Owner"}</DialogTitle>
          <DialogDescription>
            {owner ? "Update the owner's information below." : "Enter the new owner's information below."}
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInformationSection
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onPhoneChange={handlePhoneChange}
          />

          <AddressInformationSection
            formData={formData}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            cities={cities}
            isLoadingOptions={isLoadingOptions}
          />

          <IdentificationSection
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            identificationTypes={identificationTypes}
            isLoadingOptions={isLoadingOptions}
          />

          <EmergencyContactSection
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onPhoneChange={handlePhoneChange}
          />

          <SettingsConsentSection
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />

          <AdditionalNotesSection
            formData={formData}
            onInputChange={handleInputChange}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.dataProcessingConsent || hasErrors}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : owner ? "Update Owner" : "Create Owner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}