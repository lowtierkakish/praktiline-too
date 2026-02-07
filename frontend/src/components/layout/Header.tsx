import { useRouter } from "next/dist/client/components/navigation";
import Image from "next/image";
import { useState } from "react";
import { useLogout } from "@/hooks/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { mutate: logout } = useLogout();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 text-sm py-2.5">
      <nav className="mx-auto w-full px-4 sm:px-6 lg:px-8 flex basis-full items-center w-full mx-auto justify-between">
        <div className="me-5">
          <button
            className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80 cursor-pointer"
            onClick={() => router.push("/home")}
            aria-label="Martin's Project"
          >
            Martin's Project
          </button>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                className="size-9.5 inline-flex justify-center items-center rounded-full cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  className="size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
                    className="fixed top-16 right-4 bg-white backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg z-[60]"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="gap-4 sm:gap-6">
                        <div className="space-y-3 sm:space-y-4">
                          <a
                            href="/home"
                            className="p-2 sm:p-3 flex items-start gap-3 sm:gap-4 text-sm text-gray-800 hover:bg-gray-100 rounded-lg cursor-pointer"
                          >
                            <svg
                              className="size-4 mt-1 flex-shrink-0"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            </svg>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 text-sm sm:text-base">
                                Home Feed
                              </p>
                              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                                Discover new pins and ideas
                              </p>
                            </div>
                          </a>

                          <a
                            href="/profile"
                            className="p-2 sm:p-3 flex items-start gap-3 sm:gap-4 text-sm text-gray-800 hover:bg-gray-100 rounded-lg cursor-pointer"
                          >
                            <svg
                              className="size-4 mt-1 flex-shrink-0"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 text-sm sm:text-base">
                                Profile
                              </p>
                              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                                View and edit your profile
                              </p>
                            </div>
                          </a>
                          <a href="/auth/sign-in">
                            <button
                              className="p-2 sm:p-3 flex items-start gap-3 sm:gap-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer w-full text-left"
                              onClick={() => {
                                logout();
                                router.push("/auth/sign-in");
                              }}
                            >
                              <svg
                                className="size-4 mt-1 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              <div className="min-w-0">
                                <p className="font-medium text-gray-800 text-sm sm:text-base">
                                  Sign out
                                </p>
                                <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                                  Sign out of your account
                                </p>
                              </div>
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              className="size-9.5 inline-flex justify-center items-center rounded-full cursor-pointer"
              onClick={() => router.push("/profile")}
            >
              <img
                className="shrink-0 size-9.5 rounded-full"
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                alt="Avatar"
              />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
