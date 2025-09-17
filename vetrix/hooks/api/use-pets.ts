import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"
import type { Pet } from "@/lib/types"

// Query keys for better cache management
export const petKeys = {
  all: ["pets"] as const,
  lists: () => [...petKeys.all, "list"] as const,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: (filters: Record<string, any>) => [...petKeys.lists(), filters] as const,
  details: () => [...petKeys.all, "detail"] as const,
  detail: (id: string) => [...petKeys.details(), id] as const,
}

// Fetch pets with filters
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function usePets(filters?: Record<string, any>) {
  return useQuery({
    queryKey: petKeys.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams(filters)
      const { data } = await apiClient.get(`/pets?${params}`)
      return data
    },
  })
}

// Fetch single pet
export function usePet(id: string) {
  return useQuery({
    queryKey: petKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/pets/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Create pet mutation
export function useCreatePet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (pet: Omit<Pet, "id">) => {
      const { data } = await apiClient.post("/pets", pet)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.lists() })
      toast({
        title: "Éxito",
        description: "Mascota creada con éxito",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create pet",
        variant: "destructive",
      })
    },
  })
}

// Update pet mutation
export function useUpdatePet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...pet }: Partial<Pet> & { id: string }) => {
      const { data } = await apiClient.put(`/pets/${id}`, pet)
      return data
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any, variables: { id: string }) => {
      queryClient.setQueryData(petKeys.detail(variables.id), data)
      queryClient.invalidateQueries({ queryKey: petKeys.lists() })
      toast({
        title: "Éxito",
        description: "Mascota actualizada con éxito",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update pet",
        variant: "destructive",
      })
    },
  })
}

// Delete pet mutation
export function useDeletePet() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/pets/${id}`)
      return id
    },
    onSuccess: (id: string) => {
      queryClient.removeQueries({ queryKey: petKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: petKeys.lists() })
      toast({
        title: "Éxito",
        description: "Mascota eliminada correctamente",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete pet",
        variant: "destructive",
      })
    },
  })
}
