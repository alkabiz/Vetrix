import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"
import type { Appointment } from "@/lib/types"

// Query keys for better cache management
export const appointmentKeys = {
  all: ["appointments"] as const,
  lists: () => [...appointmentKeys.all, "list"] as const,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: (filters: Record<string, any>) => [...appointmentKeys.lists(), filters] as const,
  details: () => [...appointmentKeys.all, "detail"] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
}

// Fetch appointments with filters
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAppointments(filters?: Record<string, any>) {
  return useQuery({
    queryKey: appointmentKeys.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams(filters)
      const { data } = await apiClient.get(`/appointments?${params}`)
      return data
    },
  })
}

// Fetch single appointment
export function useAppointment(id: string) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/appointments/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Create appointment mutation
export function useCreateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (appointment: Omit<Appointment, "id">) => {
      const { data } = await apiClient.post("/appointments", appointment)
      return data
    },
    onSuccess: () => {
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      toast({
        title: "Success",
        description: "Appointment created successfully",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create appointment",
        variant: "destructive",
      })
    },
  })
}

// Update appointment mutation
export function useUpdateAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...appointment }: Partial<Appointment> & { id: string }) => {
      const { data } = await apiClient.put(`/appointments/${id}`, appointment)
      return data
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any, variables: { id: string }) => {
      // Update specific appointment in cache
      queryClient.setQueryData(appointmentKeys.detail(variables.id), data)
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      toast({
        title: "Success",
        description: "Appointment updated successfully",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update appointment",
        variant: "destructive",
      })
    },
  })
}

// Delete appointment mutation
export function useDeleteAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/appointments/${id}`)
      return id
    },
    onSuccess: (id: string) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: appointmentKeys.detail(id) })
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete appointment",
        variant: "destructive",
      })
    },
  })
}
