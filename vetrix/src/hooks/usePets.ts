import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Pet } from "@/lib/database/database"

export function usePets() {
    const { data: pets, isLoading, error } = useQuery({
        queryKey: ["pets"],
        queryFn: async () => {
            const response = await axios.get<Pet[]>("/api/pets")
            return response.data
        },
    })

    return {
        pets,
        isLoading,
        error,
    }
}
