import { apiClient } from "./api-client"
import type { Appointment } from "@/lib/database/database"

export type CreateAppointmentDTO = Omit<Appointment, "id" | "createdAt" | "updatedAt" | "appointmentNumber">
export type UpdateAppointmentDTO = Partial<CreateAppointmentDTO>

export const appointmentClient = {
    getAppointments: async (): Promise<Appointment[]> => {
        const { data } = await apiClient.get<Appointment[]>("/appointments")
        return data
    },

    getAppointmentById: async (id: number): Promise<Appointment> => {
        const { data } = await apiClient.get<Appointment>(`/appointments/${id}`)
        return data
    },

    createAppointment: async (appointmentData: CreateAppointmentDTO): Promise<Appointment> => {
        const { data } = await apiClient.post<Appointment>("/appointments", appointmentData)
        return data
    },

    updateAppointment: async (id: number, appointmentData: UpdateAppointmentDTO): Promise<Appointment> => {
        const { data } = await apiClient.put<Appointment>(`/appointments/${id}`, appointmentData)
        return data
    },

    deleteAppointment: async (id: number): Promise<void> => {
        await apiClient.delete(`/appointments/${id}`)
    },
}
