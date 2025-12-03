import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Species } from "@/lib/database/database"

export function useSpecies() {
    const { data: species, isLoading, error } = useQuery({
        queryKey: ["species"],
        queryFn: async () => {
            const response = await axios.get<Species[]>("/api/species")
            return response.data
        },
    })

    return {
        species,
        isLoading,
        error,
    }
}
