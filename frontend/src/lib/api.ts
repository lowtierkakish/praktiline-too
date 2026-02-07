import { useServerErrorStore } from "@/zustand/server-error-state"
import axios from "axios"
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

apiClient.interceptors.response.use(
    (response) => {
        if (useServerErrorStore.getState().isServerDown) {
            useServerErrorStore.getState().setServerDown(false)
        }
        return response
    },
    (error) => {
        const { response } = error

        if (response && response.status === 401) {
            console.error(
                "Authentication error:",
                response.data?.message || "Unauthorized",
            )
        } else if (response && response.status === 403) {
            console.error(
                "Permission denied:",
                response.data?.message || "Forbidden",
            )
        } else if (response && response.status === 404) {
            console.error(
                "Resource not found:",
                response.data?.message || "Not found",
            )
        } else if (response && response.status >= 500) {
            console.error(
                "Server error:",
                response.data?.message || "Server error",
            )
            useServerErrorStore.getState().setServerDown(true)
        } else {
            console.error("API request failed:", error.message)
        }

        return Promise.reject(error)
    },
)
