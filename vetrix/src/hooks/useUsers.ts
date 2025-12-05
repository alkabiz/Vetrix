import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { UserDTO, PaginatedResponse, UserUpdateInput, BulkDeleteRequest, BulkRoleChangeRequest } from "@/lib/api/types/user.types"
import { useToast } from "@/hooks/use-toast"

interface UseUsersOptions {
    page?: number
    limit?: number
    search?: string
    roleId?: number
    statusId?: number
    enablePagination?: boolean
}

/**
 * Custom hook for managing users data
 * Provides queries and mutations for user CRUD operations with pagination and bulk actions
 */
export function useUsers(options: UseUsersOptions = {}) {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const {
        page = 1,
        limit = 20,
        search,
        roleId,
        statusId,
        enablePagination = false,
    } = options

    // ============================================================================
    // Queries
    // ============================================================================

    /**
     * Fetch users with optional pagination
     */
    const { data, isLoading, error } = useQuery({
        queryKey: ["users", page, limit, search, roleId, statusId, enablePagination],
        queryFn: async () => {
            if (enablePagination) {
                // Fetch paginated users
                const params = new URLSearchParams()
                params.append("page", page.toString())
                params.append("limit", limit.toString())
                if (search) params.append("search", search)
                if (roleId !== undefined) params.append("roleId", roleId.toString())
                if (statusId !== undefined) params.append("statusId", statusId.toString())

                const response = await axios.get<PaginatedResponse<UserDTO>>(`/api/users?${params.toString()}`)
                return response.data
            } else {
                // Fetch all users (legacy)
                const response = await axios.get<{ users: UserDTO[] }>("/api/users")
                return { users: response.data.users }
            }
        },
    })

    // ============================================================================
    // Mutations
    // ============================================================================

    /**
     * Update user mutation
     */
    const updateUser = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UserUpdateInput }) => {
            await axios.put(`/api/users/${id}`, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast({
                title: "Success",
                description: "User updated successfully",
            })
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.error || "Failed to update user",
                variant: "destructive",
            })
        },
    })

    /**
     * Delete user mutation
     */
    const deleteUser = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`/api/users/${id}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast({
                title: "Success",
                description: "User deleted successfully",
            })
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.error || "Failed to delete user",
                variant: "destructive",
            })
        },
    })

    /**
     * Bulk delete mutation
     */
    const bulkDelete = useMutation({
        mutationFn: async (userIds: number[]) => {
            await axios.post("/api/users/bulk/delete", { userIds } as BulkDeleteRequest)
        },
        onSuccess: (_data, userIds) => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast({
                title: "Success",
                description: `${userIds.length} user(s) deleted successfully`,
            })
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.error || "Failed to delete users",
                variant: "destructive",
            })
        },
    })

    /**
     * Bulk role change mutation
     */
    const bulkRoleChange = useMutation({
        mutationFn: async ({ userIds, roleId }: BulkRoleChangeRequest) => {
            await axios.post("/api/users/bulk/role", { userIds, roleId })
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast({
                title: "Success",
                description: `Role changed for ${variables.userIds.length} user(s)`,
            })
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.response?.data?.error || "Failed to change roles",
                variant: "destructive",
            })
        },
    })

    // ============================================================================
    // Return Values
    // ============================================================================

    if (enablePagination && data && "pagination" in data) {
        return {
            users: data.data,
            pagination: data.pagination,
            isLoading,
            error,
            updateUser,
            deleteUser,
            bulkDelete,
            bulkRoleChange,
        }
    }

    return {
        users: data && "users" in data ? data.users : [],
        isLoading,
        error,
        updateUser,
        deleteUser,
        bulkDelete,
        bulkRoleChange,
    }
}
