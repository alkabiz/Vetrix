import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { OwnerDTO, OwnerInput } from "@/lib/api/types/owner.types"
import { useToast } from "@/hooks/use-toast"

export function useOwners() {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const { data: owners, isLoading, error } = useQuery({
        queryKey: ["owners"],
        queryFn: async () => {
            const response = await axios.get<OwnerDTO[]>("/api/owners")
            return response.data
        },
    })

    const createOwner = useMutation({
        mutationFn: async (newOwner: OwnerInput) => {
            const response = await axios.post<OwnerDTO>("/api/owners", newOwner)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["owners"] })
            toast({
                title: "Success",
                description: "Owner created successfully",
            })
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to create owner",
                variant: "destructive",
            })
        }
    })

    const updateOwner = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: OwnerInput }) => {
            const response = await axios.put<OwnerDTO>(`/api/owners/${id}`, data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["owners"] })
            toast({
                title: "Success",
                description: "Owner updated successfully",
            })
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to update owner",
                variant: "destructive",
            })
        }
    })

    const deleteOwner = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`/api/owners/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["owners"] })
            toast({
                title: "Success",
                description: "Owner deleted successfully",
            })
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to delete owner",
                variant: "destructive",
            })
        }
    })

    return {
        owners,
        isLoading,
        error,
        createOwner,
        updateOwner,
        deleteOwner
    }
}
