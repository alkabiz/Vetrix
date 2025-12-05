import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { UserDTO } from "@/lib/api/types/user.types"
import { useToast } from "@/hooks/use-toast"

/**
 * Custom hook for managing users data
 * Provides queries and mutations for user CRUD operations
 */
export function useUsers() {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    // Fetch all users
    const { data, isLoading, error } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await axios.get<{ users: UserDTO[] }>("/api/users")
            return response.data.users
        },
    })

    // Delete user mutation
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
        }
    })

    return {
        users: data,
        isLoading,
        error,
        deleteUser
    }
}
