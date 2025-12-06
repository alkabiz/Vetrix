import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { AuditLog, AuditAction } from "@/lib/api/types/user.types"

interface UseAuditLogOptions {
    userId?: number
    limit?: number
}

/**
 * Custom hook for fetching user audit logs
 */
export function useAuditLog(options: UseAuditLogOptions = {}) {
    const { userId, limit = 100 } = options

    const { data, isLoading, error } = useQuery({
        queryKey: ["audit-logs", userId, limit],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (userId !== undefined) params.append("userId", userId.toString())
            params.append("limit", limit.toString())

            const response = await axios.get<{ logs: AuditLog[] }>(`/api/users/audit?${params.toString()}`)
            return response.data.logs
        },
    })

    return {
        logs: data || [],
        isLoading,
        error,
    }
}

/**
 * Log an audit action
 */
/**
 * Log an audit action
 * Fire-and-forget wrapper for the audit log API
 */
export async function logAudit(action: AuditAction, details?: Record<string, any>) {
    try {
        // We use the existing endpoint which expects body properties directly,
        // or we can wrap them. The controller looks for { action, ...body }.
        // So we spread details into the body.
        await axios.post("/api/users/audit", { 
            action,
            ...details 
        })
    } catch (error) {
        console.error("Failed to log audit:", error)
    }
}
