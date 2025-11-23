import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ownerClient, type CreateOwnerDTO, type UpdateOwnerDTO } from "../clients/owner-client"

export const ownerKeys = {
    all: ["owners"] as const,
    lists: () => [...ownerKeys.all, "list"] as const,
    detail: (id: number) => [...ownerKeys.all, "detail", id] as const,
}

export const useOwners = () => {
    return useQuery({
        queryKey: ownerKeys.lists(),
        queryFn: ownerClient.getOwners,
    })
}

export const useOwner = (id: number) => {
    return useQuery({
        queryKey: ownerKeys.detail(id),
        queryFn: () => ownerClient.getOwnerById(id),
        enabled: !!id,
    })
}

export const useCreateOwner = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateOwnerDTO) => ownerClient.createOwner(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ownerKeys.lists() })
        },
    })
}

export const useUpdateOwner = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateOwnerDTO }) => ownerClient.updateOwner(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ownerKeys.lists() })
            queryClient.invalidateQueries({ queryKey: ownerKeys.detail(data.id) })
        },
    })
}

export const useDeleteOwner = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => ownerClient.deleteOwner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ownerKeys.lists() })
        },
    })
}
