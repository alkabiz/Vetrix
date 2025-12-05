import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import type { AuditLog } from "@/lib/api/types/user.types"

export interface DashboardData {
    stats: {
        totalOwners: number
        totalPets: number
        todayAppointments: number
        monthlyRevenue: number
    }
    recentActivity: AuditLog[]
    isLoading: boolean
    error: Error | null
}

/**
 * Custom hook to fetch all dashboard data
 * Consolidates multiple requests to optimize performance
 */
export function useDashboardData(): DashboardData {
    // Fetch stats
    const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery({
        queryKey: ["dashboard", "stats"],
        queryFn: async () => {
            const today = new Date().toISOString().split("T")[0]
            const currentMonth = today.slice(0, 7) // YYYY-MM format

            // Run requests in parallel
            const [ownersRes, petsRes, appointmentsRes, invoicesRes] = await Promise.all([
                axios.get<{ owners: any[] }>("/api/owners"),
                axios.get<{ pets: any[] }>("/api/pets"),
                axios.get<{ appointments: any[] }>(`/api/appointments?date=${today}`),
                axios.get<{ invoices: any[] }>(`/api/invoices?month=${currentMonth}`)
            ])

            // Calculate revenue
            const monthlyRevenue = invoicesRes.data.invoices
                .filter((inv: any) => inv.status === "paid" || inv.status === "Paid")
                .reduce((sum: number, inv: any) => sum + (inv.totalAmount || 0), 0)

            return {
                totalOwners: ownersRes.data.owners.length,
                totalPets: petsRes.data.pets.length,
                todayAppointments: appointmentsRes.data.appointments.length,
                monthlyRevenue
            }
        }
    })

    // Fetch recent activity
    const { data: activityData, isLoading: activityLoading, error: activityError } = useQuery({
        queryKey: ["dashboard", "activity"],
        queryFn: async () => {
            // Fetch last 5 logs for dashboard
            const response = await axios.get<{ logs: AuditLog[] }>("/api/users/audit?limit=5")
            return response.data.logs
        }
    })

    return {
        stats: statsData || {
            totalOwners: 0,
            totalPets: 0,
            todayAppointments: 0,
            monthlyRevenue: 0
        },
        recentActivity: activityData || [],
        isLoading: statsLoading || activityLoading,
        error: (statsError as Error) || (activityError as Error) || null
    }
}
