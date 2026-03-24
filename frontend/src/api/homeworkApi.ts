import { apiClient } from "@/lib/api"

export type Homework = {
    id: number
    subject: string
    description: string
    day: number
    type: "kodutöö" | "tunnitöö" | "kontrolltöö"
    created_at: string
}

export const homeworkApi = {
    getAll: async (): Promise<Homework[]> => {
        const res = await apiClient.get("/homework/")
        return res.data
    },
    create: async (data: { subject: string; description: string; day: number; type: string }): Promise<Homework> => {
        const res = await apiClient.post("/homework/", data)
        return res.data
    },
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/homework/${id}`)
    },
}