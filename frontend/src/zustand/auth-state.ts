import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
};

type AuthState = {
    user: User | null;
    setUser: (user: User | null) => void;
    clearAuth: () => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,

            setUser: (user) => set({ user }),

            clearAuth: () => set({ user: null }),

            logout: () => {
                set({ user: null });
                window.location.href = '/auth/sign-in';
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user }),
        }
    )
);
