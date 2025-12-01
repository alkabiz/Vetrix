import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Appointment } from "@/lib/database/database"

export function useAppointments() {
    const { data: appointments, isLoading, error } = useQuery({
        queryKey: ["appointments"],
        queryFn: async () => {
            const response = await axios.get<Appointment[]>("/api/appointments")
            return response.data
        },
    })

    return {
        appointments,
        isLoading,
        error,
    }
}
