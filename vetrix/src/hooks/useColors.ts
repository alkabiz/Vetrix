import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Color } from "@/lib/database/database"

export function useColors() {
    const { data: colors, isLoading, error } = useQuery({
        queryKey: ["colors"],
        queryFn: async () => {
            const response = await axios.get<Color[]>("/api/colors")
            return response.data
        },
    })

    return {
        colors,
        isLoading,
        error,
    }
}
