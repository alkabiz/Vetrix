import { getDatabase } from "@/lib/database/database"
import { NotFoundError } from "@/lib/utils/error-handler"
import { VeterinarianEntity, VeterinarianDTO, CreateVeterinarianDTO, UpdateVeterinarianDTO } from "@/lib/api/types/veterinarian.types"

function mapToDTO(entity: VeterinarianEntity): VeterinarianDTO {
  return {
    id: entity.id,
    name: entity.name,
    email: entity.email,
    phone: entity.phone,
    specialization: entity.specialization,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at
  }
}

export async function getAllVeterinarians(): Promise<VeterinarianDTO[]> {
  const db = getDatabase()
  const entities = db.prepare("SELECT * FROM veterinarians").all() as VeterinarianEntity[]
  return entities.map(mapToDTO)
}

export async function getVeterinarianById(id: string): Promise<VeterinarianDTO> {
  const db = getDatabase()
  const vet = db.prepare("SELECT * FROM veterinarians WHERE id = ?").get(id) as VeterinarianEntity | undefined
  if (!vet) throw new NotFoundError("Veterinarian not found")
  return mapToDTO(vet)
}

export async function createVeterinarian(data: CreateVeterinarianDTO): Promise<VeterinarianDTO> {
  const db = getDatabase()
  const stmt = db.prepare(`
    INSERT INTO veterinarians (name, email, phone, specialization, created_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `)
  const result = stmt.run(data.name, data.email, data.phone, data.specialization)
  return getVeterinarianById(result.lastInsertRowid.toString())
}

export async function updateVeterinarian(id: string, data: UpdateVeterinarianDTO): Promise<VeterinarianDTO> {
  const db = getDatabase()

  // Build dynamic update query
  const fields: string[] = []
  const values: any[] = []

  if (data.name) { fields.push("name = ?"); values.push(data.name) }
  if (data.email) { fields.push("email = ?"); values.push(data.email) }
  if (data.phone) { fields.push("phone = ?"); values.push(data.phone) }
  if (data.specialization) { fields.push("specialization = ?"); values.push(data.specialization) }

  if (fields.length === 0) return getVeterinarianById(id)

  fields.push("updated_at = CURRENT_TIMESTAMP")
  values.push(id)

  const stmt = db.prepare(`UPDATE veterinarians SET ${fields.join(", ")} WHERE id = ?`)
  const result = stmt.run(...values)

  if (result.changes === 0) throw new NotFoundError("Veterinarian not found")
  return getVeterinarianById(id)
}

export async function deleteVeterinarian(id: string): Promise<void> {
  const db = getDatabase()
  const result = db.prepare("DELETE FROM veterinarians WHERE id = ?").run(id)
  if (result.changes === 0) throw new NotFoundError("Veterinarian not found")
}