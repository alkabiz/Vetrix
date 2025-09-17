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
import type { Pet, Owner } from "@/lib/database"

interface PetFormProps {
  pet?: Pet | null
  owners: Owner[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (pet: Omit<Pet, "id" | "createdAt" | "updatedAt">) => Promise<void>
}

export function PetForm({ pet, owners, open, onOpenChange, onSubmit }: PetFormProps) {
  const [formData, setFormData] = useState({
    petNumber: "",
    ownerId: "",
    name: "",
    speciesId: "",
    breedId: "",
    sexId: "",
    primaryColorId: "",
    secondaryColorId: "",
    dateOfBirth: "",
    isBirthEstimated: false,
    microchipNumber: "",
    microchipDate: "",
    microchipLocation: "",
    tattooNumber: "",
    isSterilized: false,
    sterilizationDate: "",
    sterilizationTypeId: "",
    registrationNumber: "",
    isActive: true,
    dateOfDeath: "",
    causeOfDeath: "",
    specialNeeds: "",
    behavioralNotes: "",
    dietaryRestrictions: "",
    exerciseRequirements: "",
    acquisitionDate: "",
    acquisitionSource: "",
    previousOwnerInfo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (pet) {
      setFormData({
        petNumber: pet.petNumber || "",
        ownerId: String(pet.ownerId),
        name: pet.name || "",
        speciesId: pet.speciesId ? String(pet.speciesId) : "",
        breedId: pet.breedId ? String(pet.breedId) : "",
        sexId: String(pet.sexId),
        primaryColorId: pet.primaryColorId ? String(pet.primaryColorId) : "",
        secondaryColorId: pet.secondaryColorId ? String(pet.secondaryColorId) : "",
        dateOfBirth: pet.dateOfBirth ? new Date(pet.dateOfBirth).toISOString().split("T")[0] : "",
        isBirthEstimated: pet.isBirthEstimated,
        microchipNumber: pet.microchipNumber || "",
        microchipDate: pet.microchipDate ? new Date(pet.microchipDate).toISOString().split("T")[0] : "",
        microchipLocation: pet.microchipLocation || "",
        tattooNumber: pet.tattooNumber || "",
        isSterilized: pet.isSterilized || false,
        sterilizationDate: pet.sterilizationDate ? new Date(pet.sterilizationDate).toISOString().split("T")[0] : "",
        sterilizationTypeId: pet.sterilizationTypeId ? String(pet.sterilizationTypeId) : "",
        registrationNumber: pet.registrationNumber || "",
        isActive: pet.isActive,
        dateOfDeath: pet.dateOfDeath ? new Date(pet.dateOfDeath).toISOString().split("T")[0] : "",
        causeOfDeath: pet.causeOfDeath || "",
        specialNeeds: pet.specialNeeds || "",
        behavioralNotes: pet.behavioralNotes || "",
        dietaryRestrictions: pet.dietaryRestrictions || "",
        exerciseRequirements: pet.exerciseRequirements || "",
        acquisitionDate: pet.acquisitionDate ? new Date(pet.acquisitionDate).toISOString().split("T")[0] : "",
        acquisitionSource: pet.acquisitionSource || "",
        previousOwnerInfo: pet.previousOwnerInfo || "",
      })
    } else {
      // Generate pet number automatically
      const petNumber = `PET${Date.now().toString().slice(-6)}`
      setFormData({
        petNumber,
        ownerId: "",
        name: "",
        speciesId: "",
        breedId: "",
        sexId: "",
        primaryColorId: "",
        secondaryColorId: "",
        dateOfBirth: "",
        isBirthEstimated: false,
        microchipNumber: "",
        microchipDate: "",
        microchipLocation: "",
        tattooNumber: "",
        isSterilized: false,
        sterilizationDate: "",
        sterilizationTypeId: "",
        registrationNumber: "",
        isActive: true,
        dateOfDeath: "",
        causeOfDeath: "",
        specialNeeds: "",
        behavioralNotes: "",
        dietaryRestrictions: "",
        exerciseRequirements: "",
        acquisitionDate: "",
        acquisitionSource: "",
        previousOwnerInfo: "",
      })
    }
  }, [pet, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const petData = {
        petNumber: formData.petNumber,
        ownerId: Number(formData.ownerId),
        name: formData.name,
        speciesId: Number(formData.speciesId),
        breedId: formData.breedId ? Number(formData.breedId) : undefined,
        sexId: Number(formData.sexId),
        primaryColorId: formData.primaryColorId ? Number(formData.primaryColorId) : undefined,
        secondaryColorId: formData.secondaryColorId ? Number(formData.secondaryColorId) : undefined,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
        isBirthEstimated: formData.isBirthEstimated,
        microchipNumber: formData.microchipNumber || undefined,
        microchipDate: formData.microchipDate ? new Date(formData.microchipDate) : undefined,
        microchipLocation: formData.microchipLocation || undefined,
        tattooNumber: formData.tattooNumber || undefined,
        isSterilized: formData.isSterilized,
        sterilizationDate: formData.sterilizationDate ? new Date(formData.sterilizationDate) : undefined,
        sterilizationTypeId: formData.sterilizationTypeId ? Number(formData.sterilizationTypeId) : undefined,
        registrationNumber: formData.registrationNumber || undefined,
        isActive: formData.isActive,
        dateOfDeath: formData.dateOfDeath ? new Date(formData.dateOfDeath) : undefined,
        causeOfDeath: formData.causeOfDeath || undefined,
        specialNeeds: formData.specialNeeds || undefined,
        behavioralNotes: formData.behavioralNotes || undefined,
        dietaryRestrictions: formData.dietaryRestrictions || undefined,
        exerciseRequirements: formData.exerciseRequirements || undefined,
        acquisitionDate: formData.acquisitionDate ? new Date(formData.acquisitionDate) : undefined,
        acquisitionSource: formData.acquisitionSource || undefined,
        previousOwnerInfo: formData.previousOwnerInfo || undefined,
      }

      await onSubmit(petData)
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting pet:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{pet ? "Edit Pet" : "Add New Pet"}</DialogTitle>
          <DialogDescription>
            {pet ? "Update the pet's information below." : "Enter the new pet's information below."}
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
                  <Label htmlFor="petNumber">Pet Number *</Label>
                  <Input
                    id="petNumber"
                    value={formData.petNumber}
                    onChange={(e) => setFormData({ ...formData, petNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerId">Owner *</Label>
                  <Select
                    value={formData.ownerId}
                    onValueChange={(value) => setFormData({ ...formData, ownerId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {owners.map((owner) => (
                        <SelectItem key={owner.id} value={String(owner.id)}>
                          {owner.firstName} {owner.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Pet Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="speciesId">Species *</Label>
                  <Select
                    value={formData.speciesId}
                    onValueChange={(value) => setFormData({ ...formData, speciesId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Dog</SelectItem>
                      <SelectItem value="2">Cat</SelectItem>
                      <SelectItem value="3">Bird</SelectItem>
                      <SelectItem value="4">Rabbit</SelectItem>
                      <SelectItem value="5">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="breedId">Breed</Label>
                  <Select
                    value={formData.breedId}
                    onValueChange={(value) => setFormData({ ...formData, breedId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select breed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Golden Retriever</SelectItem>
                      <SelectItem value="2">German Shepherd</SelectItem>
                      <SelectItem value="3">Siamese</SelectItem>
                      <SelectItem value="4">Persian</SelectItem>
                      <SelectItem value="5">Mixed Breed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexId">Sex *</Label>
                  <Select value={formData.sexId} onValueChange={(value) => setFormData({ ...formData, sexId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Male</SelectItem>
                      <SelectItem value="2">Female</SelectItem>
                      <SelectItem value="3">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColorId">Primary Color</Label>
                  <Select
                    value={formData.primaryColorId}
                    onValueChange={(value) => setFormData({ ...formData, primaryColorId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Black</SelectItem>
                      <SelectItem value="2">Brown</SelectItem>
                      <SelectItem value="3">White</SelectItem>
                      <SelectItem value="4">Golden</SelectItem>
                      <SelectItem value="5">Gray</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColorId">Secondary Color</Label>
                  <Select
                    value={formData.secondaryColorId}
                    onValueChange={(value) => setFormData({ ...formData, secondaryColorId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Black</SelectItem>
                      <SelectItem value="2">Brown</SelectItem>
                      <SelectItem value="3">White</SelectItem>
                      <SelectItem value="4">Golden</SelectItem>
                      <SelectItem value="5">Gray</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Birth & Age Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Birth & Age Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Checkbox
                    id="isBirthEstimated"
                    checked={formData.isBirthEstimated}
                    onCheckedChange={(checked) => setFormData({ ...formData, isBirthEstimated: checked as boolean })}
                  />
                  <Label htmlFor="isBirthEstimated">Birth date is estimated</Label>
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
                  <Label htmlFor="microchipNumber">Microchip Number</Label>
                  <Input
                    id="microchipNumber"
                    value={formData.microchipNumber}
                    onChange={(e) => setFormData({ ...formData, microchipNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="microchipDate">Microchip Date</Label>
                  <Input
                    id="microchipDate"
                    type="date"
                    value={formData.microchipDate}
                    onChange={(e) => setFormData({ ...formData, microchipDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="microchipLocation">Microchip Location</Label>
                  <Input
                    id="microchipLocation"
                    value={formData.microchipLocation}
                    onChange={(e) => setFormData({ ...formData, microchipLocation: e.target.value })}
                    placeholder="e.g., Left shoulder"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tattooNumber">Tattoo Number</Label>
                  <Input
                    id="tattooNumber"
                    value={formData.tattooNumber}
                    onChange={(e) => setFormData({ ...formData, tattooNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  placeholder="Breed registry or kennel club number"
                />
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medical Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isSterilized"
                  checked={formData.isSterilized}
                  onCheckedChange={(checked) => setFormData({ ...formData, isSterilized: checked as boolean })}
                />
                <Label htmlFor="isSterilized">Pet is sterilized</Label>
              </div>
              {formData.isSterilized && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sterilizationDate">Sterilization Date</Label>
                    <Input
                      id="sterilizationDate"
                      type="date"
                      value={formData.sterilizationDate}
                      onChange={(e) => setFormData({ ...formData, sterilizationDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sterilizationTypeId">Sterilization Type</Label>
                    <Select
                      value={formData.sterilizationTypeId}
                      onValueChange={(value) => setFormData({ ...formData, sterilizationTypeId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Spay (Female)</SelectItem>
                        <SelectItem value="2">Neuter (Male)</SelectItem>
                        <SelectItem value="3">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="specialNeeds">Special Needs</Label>
                <Textarea
                  id="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                  rows={2}
                  placeholder="Any special medical needs or conditions..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                <Textarea
                  id="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                  rows={2}
                  placeholder="Food allergies, special diet requirements..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Behavioral & Care Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Behavioral & Care Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="behavioralNotes">Behavioral Notes</Label>
                <Textarea
                  id="behavioralNotes"
                  value={formData.behavioralNotes}
                  onChange={(e) => setFormData({ ...formData, behavioralNotes: e.target.value })}
                  rows={2}
                  placeholder="Temperament, behavioral issues, training notes..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exerciseRequirements">Exercise Requirements</Label>
                <Textarea
                  id="exerciseRequirements"
                  value={formData.exerciseRequirements}
                  onChange={(e) => setFormData({ ...formData, exerciseRequirements: e.target.value })}
                  rows={2}
                  placeholder="Exercise needs, activity level, restrictions..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Acquisition Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acquisition Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="acquisitionDate">Acquisition Date</Label>
                  <Input
                    id="acquisitionDate"
                    type="date"
                    value={formData.acquisitionDate}
                    onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acquisitionSource">Acquisition Source</Label>
                  <Input
                    id="acquisitionSource"
                    value={formData.acquisitionSource}
                    onChange={(e) => setFormData({ ...formData, acquisitionSource: e.target.value })}
                    placeholder="e.g., Breeder, Shelter, Rescue"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="previousOwnerInfo">Previous Owner Information</Label>
                <Textarea
                  id="previousOwnerInfo"
                  value={formData.previousOwnerInfo}
                  onChange={(e) => setFormData({ ...formData, previousOwnerInfo: e.target.value })}
                  rows={2}
                  placeholder="Information about previous owners, if applicable..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
            />
            <Label htmlFor="isActive">Active pet</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.ownerId}>
              {isSubmitting ? "Saving..." : pet ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
