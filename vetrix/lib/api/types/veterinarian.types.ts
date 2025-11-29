export interface VeterinarianEntity {
    id: string
    name: string
    email: string
    phone: string
    specialization: string
    created_at: string
    updated_at?: string
}

export interface VeterinarianDTO {
    id: string
    name: string
    email: string
    phone: string
    specialization: string
    createdAt: string
    updatedAt?: string
}

export type CreateVeterinarianDTO = Omit<VeterinarianDTO, "id" | "createdAt" | "updatedAt">
export type UpdateVeterinarianDTO = Partial<CreateVeterinarianDTO>
