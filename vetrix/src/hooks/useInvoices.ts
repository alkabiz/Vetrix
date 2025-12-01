import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { InvoiceDTO } from "@/lib/api/types/invoice.types"

export function useInvoices() {
    const queryClient = useQueryClient()

    const { data: invoices, isLoading, error } = useQuery({
        queryKey: ["invoices"],
        queryFn: async () => {
            const response = await axios.get<InvoiceDTO[]>("/api/invoices")
            return response.data
        },
    })

    const createInvoice = useMutation({
        mutationFn: async (newInvoice: Partial<InvoiceDTO>) => {
            const response = await axios.post<InvoiceDTO>("/api/invoices", newInvoice)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] })
        },
    })

    const updateInvoice = useMutation({
        mutationFn: async ({ id, ...data }: Partial<InvoiceDTO> & { id: number }) => {
            const response = await axios.put<InvoiceDTO>(`/api/invoices/${id}`, data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] })
        },
    })

    const deleteInvoice = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`/api/invoices/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] })
        },
    })

    return {
        invoices,
        isLoading,
        error,
        createInvoice,
        updateInvoice,
        deleteInvoice,
    }
}
