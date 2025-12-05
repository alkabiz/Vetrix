import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export interface DashboardStats {
    totalOwners: number
    totalPets: number
    todayAppointments: number
    monthlyRevenue: number
    isLoading: boolean
    error: Error | null
}

/**
 * Custom hook to fetch all dashboard statistics
 * Fetches data from multiple APIs in parallel
 */
export function useDashboardStats(): DashboardStats {
    // Fetch owners count
    const { data: ownersData, isLoading: ownersLoading, error: ownersError } = useQuery({
        queryKey: ["owners", "count"],
        queryFn: async () => {
            const response = await axios.get<{ owners: any[] }>("/api/owners")
            return response.data.owners.length
        },
    })

    // Fetch pets count
    const { data: petsData, isLoading: petsLoading, error: petsError } = useQuery({
        queryKey: ["pets", "count"],
        queryFn: async () => {
            const response = await axios.get<{ pets: any[] }>("/api/pets")
            return response.data.pets.length
        },
    })

    // Fetch today's appointments
    const { data: appointmentsData, isLoading: appointmentsLoading, error: appointmentsError } = useQuery({
        queryKey: ["appointments", "today"],
        queryFn: async () => {
            const today = new Date().toISOString().split("T")[0]
            const response = await axios.get<{ appointments: any[] }>(`/api/appointments?date=${today}`)
            return response.data.appointments.length
        },
    })

    // Fetch monthly revenue
    const { data: revenueData, isLoading: revenueLoading, error: revenueError } = useQuery({
        queryKey: ["invoices", "monthly-revenue"],
        queryFn: async () => {
            const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
            const response = await axios.get<{ invoices: any[] }>(`/api/invoices?month=${currentMonth}`)

            // Calculate total from paid invoices
            const total = response.data.invoices
                .filter((inv: any) => inv.status === "paid" || inv.status === "Paid")
                .reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0)

            return total
        },
    })

    return {
        totalOwners: ownersData ?? 0,
        totalPets: petsData ?? 0,
        todayAppointments: appointmentsData ?? 0,
        monthlyRevenue: revenueData ?? 0,
        isLoading: ownersLoading || petsLoading || appointmentsLoading || revenueLoading,
        error: ownersError || petsError || appointmentsError || revenueError || null,
    }
}
