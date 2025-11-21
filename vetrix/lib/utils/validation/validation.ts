import type { Pet } from "@/lib/database/database"

export function validatePetData(petData: Partial<Pet>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!petData.name?.trim()) errors.push("El nombre es requerido")
  if (!petData.ownerId) errors.push("El propietario es requerido")
  if (!petData.speciesId) errors.push("La especie es requerida")
  
  return { isValid: errors.length === 0, errors }
}