"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Veterinarian } from "@/lib/database"

interface VeterinarianFormProps {
  veterinarian?: Veterinarian | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (veterinarian: Omit<Veterinarian, "id" | "createdAt" | "updatedAt">) => Promise<void>
}

export function VeterinarianForm({ veterinarian, open, onOpenChange, onSubmit }: VeterinarianFormProps) {
  const [formData, setFormData] = useState({
    employeeNumber: "",
    firstName: "",
    lastName: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    phone: "",
    email: "",
    yearsExperience: "",
    education: "",
    certifications: [] as Array<{ name: string; date: string; body: string }>,
    specializationNotes: "",
    hireDate: "",
    terminationDate: "",
    employmentStatusId: "1", // Active by default
    salary: "",
    commissionRate: "0",
    maxDailyAppointments: "8",
    appointmentDurationDefault: "30",
    isActive: true,
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (veterinarian) {
      setFormData({
        employeeNumber: veterinarian.employeeNumber || "",
        firstName: veterinarian.firstName || "",
        lastName: veterinarian.lastName || "",
        licenseNumber: veterinarian.licenseNumber || "",
        licenseExpiryDate: veterinarian.licenseExpiryDate
          ? new Date(veterinarian.licenseExpiryDate).toISOString().split("T")[0]
          : "",
        phone: veterinarian.phone || "",
        email: veterinarian.email || "",
        yearsExperience: veterinarian.yearsExperience ? String(veterinarian.yearsExperience) : "",
        education: veterinarian.education || "",
        certifications: veterinarian.certifications || [],
        specializationNotes: veterinarian.specializationNotes || "",
        hireDate: veterinarian.hireDate ? new Date(veterinarian.hireDate).toISOString().split("T")[0] : "",
        terminationDate: veterinarian.terminationDate
          ? new Date(veterinarian.terminationDate).toISOString().split("T")[0]
          : "",
        employmentStatusId: veterinarian.employmentStatusId ? String(veterinarian.employmentStatusId) : "1",
        salary: veterinarian.salary ? String(veterinarian.salary) : "",
        commissionRate: String(veterinarian.commissionRate || 0),
        maxDailyAppointments: String(veterinarian.maxDailyAppointments || 8),
        appointmentDurationDefault: String(veterinarian.appointmentDurationDefault || 30),
        isActive: veterinarian.isActive,
        notes: veterinarian.notes || "",
      })
    } else {
      const today = new Date().toISOString().split("T")[0]
      setFormData({
        employeeNumber: "",
        firstName: "",
        lastName: "",
        licenseNumber: "",
        licenseExpiryDate: "",
        phone: "",
        email: "",
        yearsExperience: "",
        education: "",
        certifications: [],
        specializationNotes: "",
        hireDate: today,
        terminationDate: "",
        employmentStatusId: "1",
        salary: "",
        commissionRate: "0",
        maxDailyAppointments: "8",
        appointmentDurationDefault: "30",
        isActive: true,
        notes: "",
      })
    }
  }, [veterinarian, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const veterinarianData = {
        employeeNumber: formData.employeeNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        licenseNumber: formData.licenseNumber,
        licenseExpiryDate: formData.licenseExpiryDate ? new Date(formData.licenseExpiryDate) : undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        yearsExperience: formData.yearsExperience ? Number(formData.yearsExperience) : undefined,
        education: formData.education || undefined,
        certifications: formData.certifications,
        specializationNotes: formData.specializationNotes || undefined,
        hireDate: new Date(formData.hireDate),
        terminationDate: formData.terminationDate ? new Date(formData.terminationDate) : undefined,
        employmentStatusId: formData.employmentStatusId ? Number(formData.employmentStatusId) : undefined,
        salary: formData.salary ? Number(formData.salary) : undefined,
        commissionRate: Number(formData.commissionRate),
        maxDailyAppointments: Number(formData.maxDailyAppointments),
        appointmentDurationDefault: Number(formData.appointmentDurationDefault),
        isActive: formData.isActive,
        notes: formData.notes || undefined,
      }

      await onSubmit(veterinarianData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting veterinarian:", error)
    } finally {
      setIsSubmitting(false)
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeNumber">Employee Number *</Label>
                  <Input
                    id="employeeNumber"
                    value={formData.employeeNumber}
                    onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">License Number *</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseExpiryDate">License Expiry Date</Label>
                <Input
                  id="licenseExpiryDate"
                  type="date"
                  value={formData.licenseExpiryDate}
                  onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Years of Experience</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    min="0"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentStatusId">Employment Status</Label>
                  <Select
                    value={formData.employmentStatusId}
                    onValueChange={(value) => setFormData({ ...formData, employmentStatusId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="2">Inactive</SelectItem>
                      <SelectItem value="3">On Leave</SelectItem>
                      <SelectItem value="4">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  rows={2}
                  placeholder="Educational background, degrees, institutions..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specializationNotes">Specialization Notes</Label>
                <Textarea
                  id="specializationNotes"
                  value={formData.specializationNotes}
                  onChange={(e) => setFormData({ ...formData, specializationNotes: e.target.value })}
                  rows={2}
                  placeholder="Areas of specialization, special interests..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Employment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hireDate">Hire Date *</Label>
                  <Input
                    id="hireDate"
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terminationDate">Termination Date</Label>
                  <Input
                    id="terminationDate"
                    type="date"
                    value={formData.terminationDate}
                    onChange={(e) => setFormData({ ...formData, terminationDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="Annual salary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Schedule Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxDailyAppointments">Max Daily Appointments</Label>
                  <Input
                    id="maxDailyAppointments"
                    type="number"
                    min="1"
                    value={formData.maxDailyAppointments}
                    onChange={(e) => setFormData({ ...formData, maxDailyAppointments: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointmentDurationDefault">Default Appointment Duration (minutes)</Label>
                  <Input
                    id="appointmentDurationDefault"
                    type="number"
                    min="15"
                    step="15"
                    value={formData.appointmentDurationDefault}
                    onChange={(e) => setFormData({ ...formData, appointmentDurationDefault: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                />
                <Label htmlFor="isActive">Active Veterinarian</Label>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Any additional notes about the veterinarian..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : veterinarian ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
