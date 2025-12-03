import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Breed } from "@/lib/database/database"

export function useBreeds(speciesId?: number) {
    const { data: breeds, isLoading, error } = useQuery({
        queryKey: ["breeds", speciesId],
        queryFn: async () => {
            const url = speciesId
                ? `/api/breeds?speciesId=${speciesId}`
                : "/api/breeds"
            const response = await axios.get<Breed[]>(url)
            return response.data
        },
    })

    return {
        breeds,
        isLoading,
        error,
    }
}
