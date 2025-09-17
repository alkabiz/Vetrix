"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"
import type { User } from "@/lib/types"

// Query keys for better cache management
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: (filters: Record<string, any>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

// Fetch users with filters
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useUsers(filters?: Record<string, any>) {
  return useQuery({
    queryKey: userKeys.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams(filters)
      const { data } = await apiClient.get(`/users?${params}`)
      return data
    },
  })
}

// Fetch single user
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/users/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Create user mutation
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (user: Omit<User, "id">) => {
      const { data } = await apiClient.post("/users", user)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      toast({
        title: "Éxito",
        description: "Usuario creado correctamente",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create user",
        variant: "destructive",
      })
    },
  })
}

// Update user mutation
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...user }: Partial<User> & { id: string }) => {
      const { data } = await apiClient.put(`/users/${id}`, user)
      return data
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any, variables: { id: string }) => {
      queryClient.setQueryData(userKeys.detail(variables.id), data)
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      toast({
        title: "Éxito",
        description: "Usuario actualizado correctamente",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update user",
        variant: "destructive",
      })
    },
  })
}

// Delete user mutation
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/users/${id}`)
      return id
    },
    onSuccess: (id: string) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      toast({
        title: "Éxito",
        description: "Usuario eliminado correctamente",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete user",
        variant: "destructive",
      })
    },
  })
}
