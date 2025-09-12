"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Pet, Owner } from "@/lib/database"

interface PetFormProps {
  pet?: Pet | null
  owners: Owner[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (pet: Omit<Pet, "id" | "created_at" | "updated_at" | "owner_name">) => Promise<void>
}

export function PetForm({ pet, owners, open, onOpenChange, onSubmit }: PetFormProps) {
  const [formData, setFormData] = useState({
    owner_id: "",
    name: "",
    species: "",
    breed: "",
    sex: "" as "Male" | "Female" | "Unknown" | "",
    age: "",
    weight: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (pet) {
      setFormData({
        owner_id: String(pet.owner_id),
        name: pet.name || "",
        species: pet.species || "",
        breed: pet.breed || "",
        sex: pet.sex || "",
        age: pet.age ? String(pet.age) : "",
        weight: pet.weight ? String(pet.weight) : "",
        notes: pet.notes || "",
      })
    } else {
      setFormData({
        owner_id: "",
        name: "",
        species: "",
        breed: "",
        sex: "",
        age: "",
        weight: "",
        notes: "",
      })
    }
  }, [pet, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const petData = {
        owner_id: Number(formData.owner_id),
        name: formData.name,
        species: formData.species,
        breed: formData.breed || undefined,
        sex: formData.sex || undefined,
        age: formData.age ? Number(formData.age) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        notes: formData.notes || undefined,
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{pet ? "Edit Pet" : "Add New Pet"}</DialogTitle>
          <DialogDescription>
            {pet ? "Update the pet's information below." : "Enter the new pet's information below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="owner_id">Owner *</Label>
            <Select value={formData.owner_id} onValueChange={(value) => setFormData({ ...formData, owner_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select an owner" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem key={owner.id} value={String(owner.id)}>
                    {owner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <div className="space-y-2">
            <Label htmlFor="species">Species *</Label>
            <Input
              id="species"
              value={formData.species}
              onChange={(e) => setFormData({ ...formData, species: e.target.value })}
              placeholder="e.g., Dog, Cat, Bird"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="breed">Breed</Label>
            <Input
              id="breed"
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              placeholder="e.g., Golden Retriever, Siamese"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Select value={formData.sex} onValueChange={(value) => setFormData({ ...formData, sex: value as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                min="0"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (lbs)</Label>
            <Input
              id="weight"
              type="number"
              min="0"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Any additional notes about the pet..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.owner_id}>
              {isSubmitting ? "Saving..." : pet ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
