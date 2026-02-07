import { ca } from "zod/v4/locales";

export const authKeys = {
    all: ["auth"] as const,
    currentUser: () => [...authKeys.all, "currentUser"] as const,
    user: (userId: number) => [...authKeys.all, "user", userId] as const,
};

export const userKeys = {
  billingPortal: () => ["billingPortal"] as const,
  changeProfileName: () => ["changeProfileName"] as const,
  changePassword: () => ["changePassword"] as const,
  changeHelperVisibility: () => ["changeHelperVisibility"] as const,
  deleteAccount: () => ["deleteAccount"] as const,
};
