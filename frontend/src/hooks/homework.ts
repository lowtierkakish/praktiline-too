import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { homeworkApi } from "@/api/homeworkApi"
import { homeworkKeys } from "./api-keys"

export function useGetHomework() {
    return useQuery({
        queryKey: homeworkKeys.list(),
        queryFn: homeworkApi.getAll,
    })
}

export function useCreateHomework() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: homeworkApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: homeworkKeys.list() })
        },
    })
}

export function useDeleteHomework() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: homeworkApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: homeworkKeys.list() })
        },
    })
}