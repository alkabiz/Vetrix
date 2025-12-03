import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { PetDTO, PetInput, PetUpdateInput } from "@/lib/api/types/pet.types"
import { useToast } from "@/hooks/use-toast"

export function usePets() {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const { data: pets, isLoading, error } = useQuery({
        queryKey: ["pets"],
        queryFn: async () => {
            const response = await axios.get<PetDTO[]>("/api/pets")
            return response.data
        },
    })

    const createPet = useMutation({
        mutationFn: async (newPet: PetInput) => {
            const response = await axios.post<PetDTO>("/api/pets", newPet)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pets"] })
            toast({
                title: "Success",
                description: "Pet created successfully",
            })
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to create pet",
                variant: "destructive",
            })
        }
    })

    const updatePet = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: PetUpdateInput }) => {
            const response = await axios.put<PetDTO>(`/api/pets/${id}`, data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pets"] })
            toast({
                title: "Success",
                description: "Pet updated successfully",
            })
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to update pet",
                variant: "destructive",
            })
        }
    })

    const deletePet = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`/api/pets/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pets"] })
            toast({
                title: "Success",
                description: "Pet deleted successfully",
            })
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to delete pet",
                variant: "destructive",
            })
        }
    })

    return {
        pets,
        isLoading,
        error,
        createPet,
        updatePet,
        deletePet
    }
}
