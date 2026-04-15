import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { scheduleApi } from "@/api/scheduleApi"
import { scheduleKeys } from "./api-keys"

export function useGetSchedule() {
    return useQuery({
        queryKey: scheduleKeys.list(),
        queryFn: scheduleApi.getAll,
    })
}

export function useCreateSchedule() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: scheduleApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.list() })
        },
    })
}

export function useDeleteSchedule() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: scheduleApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: scheduleKeys.list() })
        },
    })
}
