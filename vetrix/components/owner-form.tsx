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
import type { Owner } from "@/lib/database"

interface OwnerFormProps {
  owner?: Owner | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (owner: Omit<Owner, "id" | "createdAt" | "updatedAt">) => Promise<void>
}

export function OwnerForm({ owner, open, onOpenChange, onSubmit }: OwnerFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phonePrimary: "",
    phoneSecondary: "",
    email: "",
    addressStreet: "",
    cityId: "",
    addressPostalCode: "",
    dateOfBirth: "",
    identificationTypeId: "",
    identificationNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    marketingConsent: false,
    dataProcessingConsent: true,
    isActive: true,
    creditLimit: "0",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (owner) {
      setFormData({
        firstName: owner.firstName || "",
        lastName: owner.lastName || "",
        phonePrimary: owner.phonePrimary || "",
        phoneSecondary: owner.phoneSecondary || "",
        email: owner.email || "",
        addressStreet: owner.addressStreet || "",
        cityId: owner.cityId ? String(owner.cityId) : "",
        addressPostalCode: owner.addressPostalCode || "",
        dateOfBirth: owner.dateOfBirth ? new Date(owner.dateOfBirth).toISOString().split("T")[0] : "",
        identificationTypeId: owner.identificationTypeId ? String(owner.identificationTypeId) : "",
        identificationNumber: owner.identificationNumber || "",
        emergencyContactName: owner.emergencyContactName || "",
        emergencyContactPhone: owner.emergencyContactPhone || "",
        emergencyContactRelationship: owner.emergencyContactRelationship || "",
        marketingConsent: owner.marketingConsent,
        dataProcessingConsent: owner.dataProcessingConsent,
        isActive: owner.isActive,
        creditLimit: String(owner.creditLimit || 0),
        notes: owner.notes || "",
      })
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        phonePrimary: "",
        phoneSecondary: "",
        email: "",
        addressStreet: "",
        cityId: "",
        addressPostalCode: "",
        dateOfBirth: "",
        identificationTypeId: "",
        identificationNumber: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelationship: "",
        marketingConsent: false,
        dataProcessingConsent: true,
        isActive: true,
        creditLimit: "0",
        notes: "",
      })
    }
  }, [owner, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const ownerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phonePrimary: formData.phonePrimary || undefined,
        phoneSecondary: formData.phoneSecondary || undefined,
        email: formData.email || undefined,
        addressStreet: formData.addressStreet || undefined,
        cityId: formData.cityId ? Number(formData.cityId) : undefined,
        addressPostalCode: formData.addressPostalCode || undefined,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
        identificationTypeId: formData.identificationTypeId ? Number(formData.identificationTypeId) : undefined,
        identificationNumber: formData.identificationNumber || undefined,
        emergencyContactName: formData.emergencyContactName || undefined,
        emergencyContactPhone: formData.emergencyContactPhone || undefined,
        emergencyContactRelationship: formData.emergencyContactRelationship || undefined,
        marketingConsent: formData.marketingConsent,
        dataProcessingConsent: formData.dataProcessingConsent,
        isActive: formData.isActive,
        creditLimit: Number(formData.creditLimit),
        notes: formData.notes || undefined,
      }

      await onSubmit(ownerData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting owner:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{owner ? "Edit Owner" : "Add New Owner"}</DialogTitle>
          <DialogDescription>
            {owner ? "Update the owner's information below." : "Enter the new owner's information below."}
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
                  <Label htmlFor="phonePrimary">Primary Phone</Label>
                  <Input
                    id="phonePrimary"
                    type="tel"
                    value={formData.phonePrimary}
                    onChange={(e) => setFormData({ ...formData, phonePrimary: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneSecondary">Secondary Phone</Label>
                  <Input
                    id="phoneSecondary"
                    type="tel"
                    value={formData.phoneSecondary}
                    onChange={(e) => setFormData({ ...formData, phoneSecondary: e.target.value })}
                  />
                </div>
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
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addressStreet">Street Address</Label>
                <Input
                  id="addressStreet"
                  value={formData.addressStreet}
                  onChange={(e) => setFormData({ ...formData, addressStreet: e.target.value })}
                  placeholder="Street address, apartment, suite, etc."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cityId">City</Label>
                  <Select
                    value={formData.cityId}
                    onValueChange={(value) => setFormData({ ...formData, cityId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Bogotá</SelectItem>
                      <SelectItem value="2">Medellín</SelectItem>
                      <SelectItem value="3">Cali</SelectItem>
                      <SelectItem value="4">Barranquilla</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressPostalCode">Postal Code</Label>
                  <Input
                    id="addressPostalCode"
                    value={formData.addressPostalCode}
                    onChange={(e) => setFormData({ ...formData, addressPostalCode: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Identification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="identificationTypeId">ID Type</Label>
                  <Select
                    value={formData.identificationTypeId}
                    onValueChange={(value) => setFormData({ ...formData, identificationTypeId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Cédula de Ciudadanía (CC)</SelectItem>
                      <SelectItem value="2">Cédula de Extranjería (CE)</SelectItem>
                      <SelectItem value="3">Tarjeta de Identidad (TI)</SelectItem>
                      <SelectItem value="4">Pasaporte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identificationNumber">ID Number</Label>
                  <Input
                    id="identificationNumber"
                    value={formData.identificationNumber}
                    onChange={(e) => setFormData({ ...formData, identificationNumber: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                  <Input
                    id="emergencyContactPhone"
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                  <Input
                    id="emergencyContactRelationship"
                    value={formData.emergencyContactRelationship}
                    onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                    placeholder="e.g., Spouse, Parent, Sibling"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings & Consent */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings & Consent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="creditLimit">Credit Limit</Label>
                <Input
                  id="creditLimit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.creditLimit}
                  onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="marketingConsent"
                    checked={formData.marketingConsent}
                    onCheckedChange={(checked) => setFormData({ ...formData, marketingConsent: checked as boolean })}
                  />
                  <Label htmlFor="marketingConsent">Accepts marketing communications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dataProcessingConsent"
                    checked={formData.dataProcessingConsent}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, dataProcessingConsent: checked as boolean })
                    }
                  />
                  <Label htmlFor="dataProcessingConsent">Consents to data processing *</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                  />
                  <Label htmlFor="isActive">Active client</Label>
                </div>
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
              placeholder="Any additional notes about the owner..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.dataProcessingConsent}>
              {isSubmitting ? "Saving..." : owner ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}