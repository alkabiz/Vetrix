import { apiClient } from "./api-client"
import type { Pet } from "@/lib/database/database"

export type CreatePetDTO = Omit<Pet, "id" | "createdAt" | "updatedAt" | "petNumber">
export type UpdatePetDTO = Partial<CreatePetDTO>

export const petClient = {
    getPets: async (): Promise<Pet[]> => {
        const { data } = await apiClient.get<Pet[]>("/pets")
        return data
    },

    getPetById: async (id: number): Promise<Pet> => {
        const { data } = await apiClient.get<Pet>(`/pets/${id}`)
        return data
    },

    getPetsByOwnerId: async (ownerId: number): Promise<Pet[]> => {
        const { data } = await apiClient.get<Pet[]>(`/owners/${ownerId}/pets`)
        return data
    },

    createPet: async (petData: CreatePetDTO): Promise<Pet> => {
        const { data } = await apiClient.post<Pet>("/pets", petData)
        return data
    },

    updatePet: async (id: number, petData: UpdatePetDTO): Promise<Pet> => {
        const { data } = await apiClient.put<Pet>(`/pets/${id}`, petData)
        return data
    },

    deletePet: async (id: number): Promise<void> => {
        await apiClient.delete(`/pets/${id}`)
    },
}
