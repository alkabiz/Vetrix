import { apiClient } from "./api-client"
import type { Veterinarian } from "@/lib/database/database"

export type CreateVeterinarianDTO = Omit<Veterinarian, "id" | "createdAt" | "updatedAt">
export type UpdateVeterinarianDTO = Partial<CreateVeterinarianDTO>

export const veterinarianClient = {
    getVeterinarians: async (): Promise<Veterinarian[]> => {
        const { data } = await apiClient.get<Veterinarian[]>("/veterinarians")
        return data
    },

    getVeterinarianById: async (id: number): Promise<Veterinarian> => {
        const { data } = await apiClient.get<Veterinarian>(`/veterinarians/${id}`)
        return data
    },

    createVeterinarian: async (vetData: CreateVeterinarianDTO): Promise<Veterinarian> => {
        const { data } = await apiClient.post<Veterinarian>("/veterinarians", vetData)
        return data
    },

    updateVeterinarian: async (id: number, vetData: UpdateVeterinarianDTO): Promise<Veterinarian> => {
        const { data } = await apiClient.put<Veterinarian>(`/veterinarians/${id}`, vetData)
        return data
    },

    deleteVeterinarian: async (id: number): Promise<void> => {
        await apiClient.delete(`/veterinarians/${id}`)
    },
}
