"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import Image from "next/image";

export function meta() {
  return [
    { title: "Page Not Found - Martin's Project " },
    { name: "description", content: "404 Page Not Found" },
  ];
}

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center mx-auto">
        <div className="mb-8">
          <Image
            src="/404.svg"
            alt="404 Page Not Found"
            width={400}
            height={300}
            className="mx-auto mb-6"
            priority
          />
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Hmm... we can't find that page
          </h1>
          <p className="text-gray-500 text-sm">
            The page you're looking for doesn't exist
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => router.push("/home")}
            size="lg"
            className="w-full gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
