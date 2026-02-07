import { authApi } from "@/api/authApi"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authKeys } from "./api-keys";
import { User } from "@/types/user-types";


export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            email,
            password,
        }: {
            email: string;
            password: string;
        }) => {
            const response = await authApi.login(email, password);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
        },
    });
}

export function useSignup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            first_name,
            last_name,
            email,
            password,
        }: {
            first_name: string
            last_name: string
            email: string
            password: string
        }) => {
            const response = await authApi.signup(first_name, last_name, email, password);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
        },
    });
}


export function useGetMe({ isEnabled }: { isEnabled: boolean }) {
    return useQuery({
        queryKey: authKeys.currentUser(),
        queryFn: async () => {
            const user = await authApi.getMe() as User;
            return user;
        },
        enabled: isEnabled,
        retry: false,
    });
}


export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const response = await authApi.logout()
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.all })
        },
    });
}

