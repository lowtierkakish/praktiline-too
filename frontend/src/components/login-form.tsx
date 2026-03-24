"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import clsx from "clsx";
import { isAxiosError } from "axios";

const CLASS_EMAIL = "martin.vilnevtsits@tlvl.ee";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: loginUser, isPending } = useLogin();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!password || password.trim().length === 0) {
      setError("Palun sisesta parool.");
      return;
    }

    try {
      await loginUser({ email: CLASS_EMAIL, password });
      router.push("/home");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Vale parool.");
        } else if (err.response?.status === 500) {
          setError("Serveri viga, proovi hiljem uuesti.");
        } else {
          setError("Midagi läks valesti, proovi uuesti.");
        }
      } else {
        setError("Midagi läks valesti, proovi uuesti.");
      }
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-8", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-2xl font-bold text-[#E60023]">
          Praktiline Töö
        </span>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="password" className="text-gray-700 font-medium text-sm">
            Sisesta klassi parool
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Sisesta parool..."
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={clsx(
              "h-11 px-3 text-sm rounded-md border transition-colors duration-200",
              "border-gray-200 hover:border-gray-300 focus:border-[#E60023] focus:ring-0 focus:outline-none",
              "bg-white",
              { "border-[#E60023] focus:border-[#E60023]": error },
            )}
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 p-3">
            <AlertCircle className="text-[#E60023] flex-shrink-0" size={16} />
            <p className="text-xs font-medium text-[#E60023]">{error}</p>
          </div>
        )}
        <Button
          type="submit"
          className="w-full h-11 bg-[#E60023] hover:bg-[#d50520] text-white font-medium text-sm rounded-md transition-colors duration-200"
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sisselogimine...
            </div>
          ) : (
            "Logi sisse"
          )}
        </Button>
      </div>
    </form>
  );
}
