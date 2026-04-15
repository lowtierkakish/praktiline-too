import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { materialsApi } from "@/api/materialsApi"
import { materialsKeys } from "./api-keys"

export function useGetMaterials() {
    return useQuery({
        queryKey: materialsKeys.list(),
        queryFn: materialsApi.getAll,
    })
}

export function useUploadImage() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: materialsApi.uploadImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: materialsKeys.list() })
        },
    })
}

export function useAddLink() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: materialsApi.addLink,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: materialsKeys.list() })
        },
    })
}

export function useDeleteMaterial() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: materialsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: materialsKeys.list() })
        },
    })
}
