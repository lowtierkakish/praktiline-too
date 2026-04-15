import { apiClient } from "@/lib/api"

export type Material = {
    id: number
    name: string
    type: "image" | "link"
    url: string
    created_at: string
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:8080"

export const materialsApi = {
    getAll: async (): Promise<Material[]> => {
        const res = await apiClient.get("/materials/")
        return res.data
    },
    uploadImage: async (data: FormData): Promise<Material> => {
        const res = await apiClient.post("/materials/upload", data, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        return res.data
    },
    addLink: async (data: { name: string; url: string }): Promise<Material> => {
        const res = await apiClient.post("/materials/link", data)
        return res.data
    },
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/materials/${id}`)
    },
    imageUrl: (filename: string) => `${BASE_URL}/uploads/${filename}`,
}
