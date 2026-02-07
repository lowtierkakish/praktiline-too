"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useLogin } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { AlertCircle, MessageCircle } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { isAxiosError } from "axios";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{
    email: string | null;
    pass: string | null;
    api: string | null;
  }>({ email: null, pass: null, api: null });
  const { mutateAsync: loginUser, isPending } = useLogin();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({ email: null, pass: null, api: null });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      setError((curr) => ({
        ...curr,
        email: "Please enter a valid email address.",
      }));
      return;
    }

    if (!password || password.trim().length === 0) {
      setError((curr) => ({ ...curr, pass: "Password is required." }));
      return;
    }

    try {
      const res = (await loginUser({ email, password })) as {
        message?: string;
      };
      toast.success(res.message || "Login successful");
      router.push("/home");
    } catch (err: unknown) {
      let message = "Something went wrong, please try again";
      if (isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          message = "Invalid email or password";
        } else if (err.response?.status === 500) {
          message = "Server error, please try again later";
        }
      }
      toast.error(message);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-8", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <a
          href="/"
          className="flex items-center gap-3 font-medium cursor-pointer hover:opacity-80 transition-opacity mb-2"
        >
          <span className="text-2xl font-bold text-[#E60023]">
            Martin's Praktiline Töö
          </span>
        </a>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={clsx(
              "h-11 px-3 text-sm rounded-md border transition-colors duration-200",
              "border-gray-200 hover:border-gray-300 focus:border-[#E60023] focus:ring-0 focus:outline-none",
              "bg-white",
              { "border-[#E60023] focus:border-[#E60023]": error.email },
            )}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-gray-700 font-medium text-sm"
            >
              Password
            </Label>
            <button
              type="button"
              className="text-[#E60023] hover:text-[#d50520] font-medium text-xs bg-transparent border-none p-0 cursor-pointer transition-colors duration-200"
              onClick={() =>
                toast("This feature is Coming Soon", {
                  icon: <MessageCircle className="text-[#E60023]" size={20} />,
                  duration: 6000,
                })
              }
            >
              Forgot password?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={clsx(
              "h-11 px-3 text-sm rounded-md border transition-colors duration-200",
              "border-gray-200 hover:border-gray-300 focus:border-[#E60023] focus:ring-0 focus:outline-none",
              "bg-white",
              { "border-[#E60023] focus:border-[#E60023]": error.pass },
            )}
          />
        </div>
        {(error.email || error.pass || error.api) && (
          <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 p-3">
            <AlertCircle
              className="text-[#E60023] mt-0.5 flex-shrink-0"
              size={16}
            />
            <div className="text-xs">
              {error.email && (
                <p className="font-medium text-[#E60023] mb-1">{error.email}</p>
              )}
              {error.pass && (
                <p className="font-medium text-[#E60023] mb-1">{error.pass}</p>
              )}
              {error.api && (
                <p className="font-medium text-[#E60023]">{error.api}</p>
              )}
            </div>
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
              Signing in...
            </div>
          ) : (
            "Sign in"
          )}
        </Button>
      </div>
      {/* <div className="text-center">
        <span className="text-gray-600 text-xs">Don't have an account? </span>
        <Link
          href="/auth/sign-up"
          className="text-[#E60023] hover:text-[#d50520] font-medium text-xs transition-colors duration-200 cursor-pointer"
        >
          Sign up for free
        </Link>
      </div> */}
    </form>
  );
}
