"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BasicInformationSectionProps } from "../AppointmentForm.types"

export function BasicInformationSection({
  formData,
  errors,
  owners = [],
  veterinarians = [],
  filteredPets = [],
  onFieldChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disabled = false,
}: BasicInformationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="appointmentNumber">Appointment Number *</Label>
            <Input
              id="appointmentNumber"
              value={formData.appointmentNumber ?? ""}
              onChange={(e) => onFieldChange("appointmentNumber", e.target.value)}
              required
              className={errors.appointmentNumber ? "border-destructive" : ""}
            />
            {errors.appointmentNumber && (
              <p className="text-destructive text-sm">{errors.appointmentNumber}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ownerId">Owner *</Label>
            <Select
              value={formData.ownerId ? String(formData.ownerId) : ""}
              onValueChange={(value) => onFieldChange("ownerId", value === "" ? "" : Number(value))}
            >
              <SelectTrigger className={errors.ownerId ? "border-destructive" : ""}>
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
            {errors.ownerId && <p className="text-destructive text-sm">{errors.ownerId}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="petId">Pet *</Label>
            <Select
              value={formData.petId ? String(formData.petId) : ""}
              onValueChange={(value) => onFieldChange("petId", value === "" ? "" : Number(value))}
              disabled={!formData.ownerId}
            >
              <SelectTrigger className={errors.petId ? "border-destructive" : ""}>
                <SelectValue placeholder={formData.ownerId ? "Select a pet" : "Select an owner first"} />
              </SelectTrigger>
              <SelectContent>
                {filteredPets.map((pet) => (
                  <SelectItem key={pet.id} value={String(pet.id)}>
                    {pet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.petId && <p className="text-destructive text-sm">{errors.petId}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="veterinarianId">Assigned Veterinarian</Label>
            <Select
              value={formData.veterinarianId ? String(formData.veterinarianId) : ""}
              onValueChange={(value) => onFieldChange("veterinarianId", value === "" ? "" : Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a veterinarian" />
              </SelectTrigger>
              <SelectContent>
                {veterinarians.map((vet) => (
                  <SelectItem key={vet.id} value={String(vet.id)}>
                    Dr. {vet.firstName} {vet.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}