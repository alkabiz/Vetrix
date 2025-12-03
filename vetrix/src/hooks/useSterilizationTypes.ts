import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { SterilizationType } from "@/lib/database/database"

export function useSterilizationTypes() {
    const { data: sterilizationTypes, isLoading, error } = useQuery({
        queryKey: ["sterilizationTypes"],
        queryFn: async () => {
            const response = await axios.get<SterilizationType[]>("/api/sterilization-types")
            return response.data
        },
    })

    return {
        sterilizationTypes,
        isLoading,
        error,
    }
}
