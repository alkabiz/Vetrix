import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"
import type { Owner } from "@/lib/types"

// Query keys for better cache management
export const ownerKeys = {
  all: ["owners"] as const,
  lists: () => [...ownerKeys.all, "list"] as const,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: (filters: Record<string, any>) => [...ownerKeys.lists(), filters] as const,
  details: () => [...ownerKeys.all, "detail"] as const,
  detail: (id: string) => [...ownerKeys.details(), id] as const,
}

// Fetch owners with filters
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useOwners(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ownerKeys.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams(filters)
      const { data } = await apiClient.get(`/owners?${params}`)
      return data
    },
  })
}

// Fetch single owner
export function useOwner(id: string) {
  return useQuery({
    queryKey: ownerKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/owners/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Create owner mutation
export function useCreateOwner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (owner: Omit<Owner, "id">) => {
      const { data } = await apiClient.post("/owners", owner)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ownerKeys.lists() })
      toast({
        title: "Éxito",
        description: "Propietario creado correctamente",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create owner",
        variant: "destructive",
      })
    },
  })
}

// Update owner mutation
export function useUpdateOwner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...owner }: Partial<Owner> & { id: string }) => {
      const { data } = await apiClient.put(`/owners/${id}`, owner)
      return data
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any, variables: { id: string }) => {
      queryClient.setQueryData(ownerKeys.detail(variables.id), data)
      queryClient.invalidateQueries({ queryKey: ownerKeys.lists() })
      toast({
        title: "Éxito",
        description: "Propietario actualizado correctamente",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update owner",
        variant: "destructive",
      })
    },
  })
}

// Delete owner mutation
export function useDeleteOwner() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/owners/${id}`)
      return id
    },
    onSuccess: (id: string) => {
      queryClient.removeQueries({ queryKey: ownerKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: ownerKeys.lists() })
      toast({
        title: "Éxito",
        description: "El propietario eliminó correctamente",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete owner",
        variant: "destructive",
      })
    },
  })
}
