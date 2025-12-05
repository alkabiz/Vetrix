import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import type { AuditLog } from "@/lib/api/types/user.types"
import type { DashboardMetricsDTO } from "@/lib/api/types/dto"

export interface DashboardData {
    stats: DashboardMetricsDTO
    recentActivity: AuditLog[]
    isLoading: boolean
    error: Error | null
}

/**
 * Custom hook to fetch all dashboard data
 * Consolidates multiple requests to optimize performance
 */
export function useDashboardData(): DashboardData {
    // Fetch stats from unified endpoint
    const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery({
        queryKey: ["dashboard", "metrics"],
        queryFn: async () => {
            const response = await axios.get<DashboardMetricsDTO>("/api/dashboard/metrics")
            return response.data
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
            owners: 0,
            pets: 0,
            todaysAppointments: 0,
            monthlyRevenue: 0
        },
        recentActivity: activityData || [],
        isLoading: statsLoading || activityLoading,
        error: (statsError as Error) || (activityError as Error) || null
    }
}
