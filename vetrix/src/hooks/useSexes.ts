import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Sex } from "@/lib/database/database"

export function useSexes() {
    const { data: sexes, isLoading, error } = useQuery({
        queryKey: ["sexes"],
        queryFn: async () => {
            const response = await axios.get<Sex[]>("/api/sexes")
            return response.data
        },
    })

    return {
        sexes,
        isLoading,
        error,
    }
}
