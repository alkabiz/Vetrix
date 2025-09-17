import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"
import type { Invoice } from "@/lib/types"

// Query keys for better cache management
export const invoiceKeys = {
  all: ["invoices"] as const,
  lists: () => [...invoiceKeys.all, "list"] as const,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  list: (filters: Record<string, any>) => [...invoiceKeys.lists(), filters] as const,
  details: () => [...invoiceKeys.all, "detail"] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
}

// Fetch invoices with filters
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useInvoices(filters?: Record<string, any>) {
  return useQuery({
    queryKey: invoiceKeys.list(filters || {}),
    queryFn: async () => {
      const params = new URLSearchParams(filters)
      const { data } = await apiClient.get(`/invoices?${params}`)
      return data
    },
  })
}

// Fetch single invoice
export function useInvoice(id: string) {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/invoices/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Create invoice mutation
export function useCreateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (invoice: Omit<Invoice, "id">) => {
      const { data } = await apiClient.post("/invoices", invoice)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      toast({
        title: "Éxito",
        description: "Factura creada con éxito",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create invoice",
        variant: "destructive",
      })
    },
  })
}

// Update invoice mutation
export function useUpdateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...invoice }: Partial<Invoice> & { id: string }) => {
      const { data } = await apiClient.put(`/invoices/${id}`, invoice)
      return data
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any, variables: { id: string }) => {
      queryClient.setQueryData(invoiceKeys.detail(variables.id), data)
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      toast({
        title: "Éxito",
        description: "Factura actualizada con éxito",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update invoice",
        variant: "destructive",
      })
    },
  })
}

// Delete invoice mutation
export function useDeleteInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/invoices/${id}`)
      return id
    },
    onSuccess: (id) => {
      queryClient.removeQueries({ queryKey: invoiceKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      toast({
        title: "Éxito",
        description: "Factura eliminada con éxito",
      })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete invoice",
        variant: "destructive",
      })
    },
  })
}
