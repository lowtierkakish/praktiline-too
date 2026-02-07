import { apiClient } from "@/lib/api"

export const authApi = {
    login: async (email: string, password: string) => {
        try {
            const response = await apiClient.post("/users/login", {
                email,
                password,
            })
            return response.data
        } catch (error) {
            throw error
        }
    },

    signup: async (first_name: string, last_name: string, email: string, password: string) => {
        try {
            const response = await apiClient.post("/users/register", {
                first_name,
                last_name,
                email,
                password,
            })
            return response.data
        } catch (error) {
            throw error
        }
    },

    getMe: async () => {
        try {
            const response = await apiClient.get("/me")
            return response.data
        } catch (error) {
            throw error
        }
    },

    logout: async () => {
        try {
            const response = await apiClient.post("/me/logout")
            return response.data
        } catch (error) {
            throw error
        }
    },
}