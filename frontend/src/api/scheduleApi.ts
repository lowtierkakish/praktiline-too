import { apiClient } from "@/lib/api"

export type ScheduleEntry = {
    id: number
    day: number
    slot: number
    subject: string
}

export const scheduleApi = {
    getAll: async (): Promise<ScheduleEntry[]> => {
        const res = await apiClient.get("/schedule/")
        return res.data
    },
    create: async (data: { day: number; slot: number; subject: string }): Promise<ScheduleEntry> => {
        const res = await apiClient.post("/schedule/", data)
        return res.data
    },
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/schedule/${id}`)
    },
}
