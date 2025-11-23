"use client"

import type React from "react"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import type { Veterinarian } from "@/lib/database/database"
import { veterinarianFormSchema, type VeterinarianFormValues } from "./VeterinarianForm.schema"
import { DEFAULT_VETERINARIAN_VALUES } from "./VeterinarianForm.constants"
import { BasicInfoSection } from "./sections/BasicInfoSection"
import { ProfessionalInfoSection } from "./sections/ProfessionalInfoSection"
import { EmploymentDetailsSection } from "./sections/EmploymentDetailsSection"
import { ScheduleSettingsSection } from "./sections/ScheduleSettingsSection"
import { NotesSection } from "./sections/NotesSection"

interface VeterinarianFormProps {
  veterinarian?: Veterinarian | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (veterinarian: Omit<Veterinarian, "id" | "createdAt" | "updatedAt">) => Promise<void>
}

export function VeterinarianForm({ veterinarian, open, onOpenChange, onSubmit }: VeterinarianFormProps) {
  const defaultValues = useMemo(() => {
    if (veterinarian) {
      return {
        employeeNumber: veterinarian.employeeNumber || "",
        firstName: veterinarian.firstName || "",
        lastName: veterinarian.lastName || "",
        licenseNumber: veterinarian.licenseNumber || "",
        licenseExpiryDate: veterinarian.licenseExpiryDate
          ? new Date(veterinarian.licenseExpiryDate).toISOString().split("T")[0]
          : "",
        phone: veterinarian.phone || "",
        email: veterinarian.email || "",
        yearsExperience: veterinarian.yearsExperience || 0,
        education: veterinarian.education || "",
        certifications: veterinarian.certifications || [],
        specializationNotes: veterinarian.specializationNotes || "",
        hireDate: veterinarian.hireDate ? new Date(veterinarian.hireDate).toISOString().split("T")[0] : "",
        terminationDate: veterinarian.terminationDate
          ? new Date(veterinarian.terminationDate).toISOString().split("T")[0]
          : "",
        employmentStatusId: veterinarian.employmentStatusId ? String(veterinarian.employmentStatusId) : "1",
        salary: veterinarian.salary || 0,
        commissionRate: veterinarian.commissionRate || 0,
        maxDailyAppointments: veterinarian.maxDailyAppointments || 8,
        appointmentDurationDefault: veterinarian.appointmentDurationDefault || 30,
        isActive: veterinarian.isActive,
        notes: veterinarian.notes || "",
      }
    }
    return DEFAULT_VETERINARIAN_VALUES
  }, [veterinarian])

  const form = useForm<VeterinarianFormValues>({
    resolver: zodResolver(veterinarianFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(defaultValues)
    }
  }, [open, defaultValues, form])

  const handleSubmit = async (values: VeterinarianFormValues) => {
    try {
      const veterinarianData = {
        employeeNumber: values.employeeNumber,
        firstName: values.firstName,
        lastName: values.lastName,
        licenseNumber: values.licenseNumber,
        licenseExpiryDate: values.licenseExpiryDate ? new Date(values.licenseExpiryDate) : undefined,
        phone: values.phone || undefined,
        email: values.email || undefined,
        yearsExperience: values.yearsExperience,
        education: values.education || undefined,
        certifications: values.certifications,
        specializationNotes: values.specializationNotes || undefined,
        hireDate: new Date(values.hireDate),
        terminationDate: values.terminationDate ? new Date(values.terminationDate) : undefined,
        employmentStatusId: values.employmentStatusId ? Number(values.employmentStatusId) : undefined,
        salary: values.salary,
        commissionRate: values.commissionRate,
        maxDailyAppointments: values.maxDailyAppointments,
        appointmentDurationDefault: values.appointmentDurationDefault,
        isActive: values.isActive,
        notes: values.notes || undefined,
      }

      await onSubmit(veterinarianData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting veterinarian:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{veterinarian ? "Edit Veterinarian" : "Add New Veterinarian"}</DialogTitle>
          <DialogDescription>
            {veterinarian
              ? "Update the veterinarian's information below."
              : "Enter the new veterinarian's information below."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <BasicInfoSection />
            <ProfessionalInfoSection />
            <EmploymentDetailsSection />
            <ScheduleSettingsSection />
            <NotesSection />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : veterinarian ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
