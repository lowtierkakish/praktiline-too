"use client";
import { useGetMe } from "@/hooks/auth";
import { useAuthStore } from "@/zustand/auth-state";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Loader } from "@/components/ui/Loader";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearAuth, user: storedUser } = useAuthStore();

  const publicRoutes = ["/auth/sign-in", "/auth/sign-up"];
  const redirectOnAuthRoutes = ["/auth/sign-in", "/auth/sign-up"];

  const isPublicRoute = publicRoutes.includes(pathname);
  const isRedirectOnAuthRoute = redirectOnAuthRoutes.includes(pathname);

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useGetMe({
    isEnabled: true,
  });

  useEffect(() => {
    if (isPublicRoute) {
      if (user && !isLoading && !isError && isRedirectOnAuthRoute) {
        router.push("/home");
        setIsAuth(true);
        return;
      }
      setIsAuth(true);
      return;
    }

    if (isError) {
      console.log("Authentication failed:", error);
      clearAuth();
      setIsAuth(false);
      router.push("/auth/sign-in");
      return;
    }

    if (!isLoading && !user) {
      clearAuth();
      setIsAuth(false);
      router.push("/auth/sign-in");
      return;
    }

    if (!isLoading && user && !isError && !isAuth) {
      setIsAuth(true);
      return;
    }
  }, [
    user,
    isLoading,
    isError,
    error,
    router,
    setUser,
    clearAuth,
    isPublicRoute,
    isRedirectOnAuthRoute,
    isAuth,
  ]);

  if (!isPublicRoute && (isAuth === null || isLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="text-gray-600 mt-4">Authenticating...</p>
        </div>
      </div>
    );
  }

  return isAuth ? <>{children}</> : null;
}
