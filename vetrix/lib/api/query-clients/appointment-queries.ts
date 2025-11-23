import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { appointmentClient, type CreateAppointmentDTO, type UpdateAppointmentDTO } from "../clients/appointment-client"

export const appointmentKeys = {
    all: ["appointments"] as const,
    lists: () => [...appointmentKeys.all, "list"] as const,
    detail: (id: number) => [...appointmentKeys.all, "detail", id] as const,
}

export const useAppointments = () => {
    return useQuery({
        queryKey: appointmentKeys.lists(),
        queryFn: appointmentClient.getAppointments,
    })
}

export const useAppointment = (id: number) => {
    return useQuery({
        queryKey: appointmentKeys.detail(id),
        queryFn: () => appointmentClient.getAppointmentById(id),
        enabled: !!id,
    })
}

export const useCreateAppointment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateAppointmentDTO) => appointmentClient.createAppointment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
        },
    })
}

export const useUpdateAppointment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateAppointmentDTO }) =>
            appointmentClient.updateAppointment(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
            queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(data.id) })
        },
    })
}

export const useDeleteAppointment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => appointmentClient.deleteAppointment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
        },
    })
}
