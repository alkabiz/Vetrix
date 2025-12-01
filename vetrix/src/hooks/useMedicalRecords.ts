import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { MedicalRecordDTO } from "@/lib/api/types/medical-record.types"

export function useMedicalRecords() {
    const queryClient = useQueryClient()

    const { data: records, isLoading, error } = useQuery({
        queryKey: ["medical-records"],
        queryFn: async () => {
            const response = await axios.get<MedicalRecordDTO[]>("/api/medical-records")
            return response.data
        },
    })

    const createRecord = useMutation({
        mutationFn: async (newRecord: Partial<MedicalRecordDTO>) => {
            const response = await axios.post<MedicalRecordDTO>("/api/medical-records", newRecord)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medical-records"] })
        },
    })

    const updateRecord = useMutation({
        mutationFn: async ({ id, ...data }: Partial<MedicalRecordDTO> & { id: number }) => {
            const response = await axios.put<MedicalRecordDTO>(`/api/medical-records/${id}`, data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medical-records"] })
        },
    })

    const deleteRecord = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`/api/medical-records/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medical-records"] })
        },
    })

    return {
        records,
        isLoading,
        error,
        createRecord,
        updateRecord,
        deleteRecord,
    }
}
