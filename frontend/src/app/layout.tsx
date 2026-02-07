import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ServerErrorBanner } from "@/components/layout/ServerErrorBanner";
import { Providers } from "@/app/providers";
import AuthGuard from "@/providers/AuthGuard";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Martin's Project",
  description: "Martin's Project",
  icons: {
    icon: "/frontend/src/app/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServerErrorBanner />
        <Providers>
          <AuthGuard>{children}</AuthGuard>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
