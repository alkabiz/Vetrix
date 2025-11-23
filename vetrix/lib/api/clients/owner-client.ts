import { apiClient } from "./api-client"
import type { Owner } from "@/lib/database/database"

export type CreateOwnerDTO = Omit<Owner, "id" | "createdAt" | "updatedAt">
export type UpdateOwnerDTO = Partial<CreateOwnerDTO>

export const ownerClient = {
    getOwners: async (): Promise<Owner[]> => {
        const { data } = await apiClient.get<Owner[]>("/owners")
        return data
    },

    getOwnerById: async (id: number): Promise<Owner> => {
        const { data } = await apiClient.get<Owner>(`/owners/${id}`)
        return data
    },

    createOwner: async (ownerData: CreateOwnerDTO): Promise<Owner> => {
        const { data } = await apiClient.post<Owner>("/owners", ownerData)
        return data
    },

    updateOwner: async (id: number, ownerData: UpdateOwnerDTO): Promise<Owner> => {
        const { data } = await apiClient.put<Owner>(`/owners/${id}`, ownerData)
        return data
    },

    deleteOwner: async (id: number): Promise<void> => {
        await apiClient.delete(`/owners/${id}`)
    },
}
