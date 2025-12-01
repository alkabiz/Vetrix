import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Owner } from "@/lib/database/database"

export function useOwners() {
    const { data: owners, isLoading, error } = useQuery({
        queryKey: ["owners"],
        queryFn: async () => {
            const response = await axios.get<Owner[]>("/api/owners")
            return response.data
        },
    })

    return {
        owners,
        isLoading,
        error,
    }
}
