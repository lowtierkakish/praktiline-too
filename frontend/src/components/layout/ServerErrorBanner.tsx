"use client";
import { AlertCircle } from "lucide-react";
import { useServerErrorStore } from "@/zustand/server-error-state";

export const ServerErrorBanner = () => {
  const isServerDown = useServerErrorStore((state) => state.isServerDown);
  if (!isServerDown) return null;
  return (
    <div className="fixed bottom-0 z-60 flex w-full items-center justify-center gap-3 bg-red-400/70 backdrop-blur-xl py-1 px-4 text-center text-white shadow-lg border-t border-red-300">
      <AlertCircle size={15} className="mr-2" />
      <span className="font-medium drop-shadow">
        Backend server is currently down. Please try again later.
      </span>
    </div>
  );
};
