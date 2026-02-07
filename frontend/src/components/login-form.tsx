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
          <Image
            src="/favicon-32x32.png"
            alt="Martin's Project Logo"
            width={32}
            height={32}
            priority
          />
          <span className="text-2xl font-bold text-[#E60023]">
            Martin's Project
          </span>
        </a>
        <p className="text-gray-600 text-xs max-w-sm">
          Sign in to your Martin's Project account to continue discovering ideas
        </p>
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
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white"></div>
          </div>
          <div className="relative bg-white rounded-sm px-4">
            <span className="text-gray-500 text-xs font-medium">
              or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full h-11 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium text-sm rounded-md transition-colors duration-200 bg-white hover:bg-gray-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5 mr-3"
          >
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Continue with GitHub
        </Button>
      </div>
      <div className="text-center">
        <span className="text-gray-600 text-xs">Don't have an account? </span>
        <Link
          href="/auth/sign-up"
          className="text-[#E60023] hover:text-[#d50520] font-medium text-xs transition-colors duration-200 cursor-pointer"
        >
          Sign up for free
        </Link>
      </div>
    </form>
  );
}
