import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"
import type { MedicalRecord } from "@/lib/types"

// Query keys for better cache management
export const medicalRecordKeys = {
  all: ["medical-records"] as const,
  lists: () => [...medicalRecordKeys.all, "list"] as const,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: (filters: Record<string, any>) => [...medicalRecordKeys.lists(), filters] as const,
  details: () => [...medicalRecordKeys.all, "detail"] as const,
  detail: (id: string) => [...medicalRecordKeys.details(), id] as const,
}

// Fetch medical records with filters
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useMedicalRecords(filters?: Record<string, any>) {
  return useQuery({
    queryKey: medicalRecordKeys.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams(filters)
      const { data } = await apiClient.get(`/medical-records?${params}`)
      return data
    },
  })
}

// Fetch single medical record
export function useMedicalRecord(id: string) {
  return useQuery({
    queryKey: medicalRecordKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/medical-records/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Create medical record mutation
export function useCreateMedicalRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (record: Omit<MedicalRecord, "id">) => {
      const { data } = await apiClient.post("/medical-records", record)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.lists() })
      toast({
        title: "Éxito",
        description: "Expediente médico creado correctamente",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create medical record",
        variant: "destructive",
      })
    },
  })
}

// Update medical record mutation
export function useUpdateMedicalRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...record }: Partial<MedicalRecord> & { id: string }) => {
      const { data } = await apiClient.put(`/medical-records/${id}`, record)
      return data
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any, variables: { id: string }) => {
      queryClient.setQueryData(medicalRecordKeys.detail(variables.id), data)
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.lists() })
      toast({
        title: "Éxito",
        description: "Expediente médico actualizado correctamente",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update medical record",
        variant: "destructive",
      })
    },
  })
}

// Delete medical record mutation
export function useDeleteMedicalRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/medical-records/${id}`)
      return id
    },
    onSuccess: (id: string) => {
      queryClient.removeQueries({ queryKey: medicalRecordKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.lists() })
      toast({
        title: "Éxito",
        description: "Expediente médico eliminado correctamente",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete medical record",
        variant: "destructive",
      })
    },
  })
}
