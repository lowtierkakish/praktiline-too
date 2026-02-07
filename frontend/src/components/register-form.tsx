"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSignup } from "@/hooks/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { isAxiosError } from "axios";
import { AlertCircle } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";
import Image from "next/image";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: signup, isPending } = useSignup();

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim()) {
      toast.error("First name is required.");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Last name is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      toast.error("Password is required.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      const res = (await signup({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      })) as { message?: string };
      toast.success(res.message || "Account created successfully!");
      router.push("/home");
    } catch (err: unknown) {
      let message = "Registration failed. Please try again.";
      if (isAxiosError(err)) {
        if (err.response?.status === 409) {
          message = "This email is already registered.";
        } else if (err.response?.data?.message) {
          message = err.response.data.message;
        }
      }
      toast.error(message);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-8", className)}
      onSubmit={handleRegister}
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
          Create your Martin's Project account to start discovering ideas
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label
            htmlFor="firstName"
            className="text-gray-700 font-medium text-sm"
          >
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="h-11 px-3 text-sm rounded-md border transition-colors duration-200 border-gray-200 hover:border-gray-300 focus:border-[#E60023] focus:ring-0 focus:outline-none bg-white"
          />
        </div>
        <div className="grid gap-3">
          <Label
            htmlFor="lastName"
            className="text-gray-700 font-medium text-sm"
          >
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="h-11 px-3 text-sm rounded-md border transition-colors duration-200 border-gray-200 hover:border-gray-300 focus:border-[#E60023] focus:ring-0 focus:outline-none bg-white"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email" className="text-gray-700 font-medium text-sm">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 px-3 text-sm rounded-md border transition-colors duration-200 border-gray-200 hover:border-gray-300 focus:border-[#E60023] focus:ring-0 focus:outline-none bg-white"
          />
        </div>
        <div className="grid gap-3">
          <Label
            htmlFor="password"
            className="text-gray-700 font-medium text-sm"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 px-3 text-sm rounded-md border transition-colors duration-200 border-gray-200 hover:border-gray-300 focus:border-[#E60023] focus:ring-0 focus:outline-none bg-white"
          />
        </div>
        <Button
          type="submit"
          className="w-full h-11 bg-[#E60023] hover:bg-[#d50520] text-white font-medium text-sm rounded-md transition-colors duration-200"
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Registering...
            </div>
          ) : (
            "Register"
          )}
        </Button>
        <div className="text-center">
          <span className="text-gray-600 text-xs">
            Already have an account?{" "}
          </span>
          <Link
            href="/auth/sign-in"
            className="text-[#E60023] hover:text-[#d50520] font-medium text-xs transition-colors duration-200 cursor-pointer"
          >
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
}
