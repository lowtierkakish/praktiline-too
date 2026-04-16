import { useRouter } from "next/dist/client/components/navigation";
import { useLogout } from "@/hooks/auth";

export default function Header() {
  const router = useRouter();
  const { mutate: logout } = useLogout();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 text-sm py-2.5">
      <nav className="mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <button
          className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80 cursor-pointer"
          onClick={() => router.push("/home")}
        >
          Praktiline Töö
        </button>
        <button
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          onClick={() => {
            logout();
            router.push("/auth/sign-in");
          }}
        >
          Logi välja
        </button>
      </nav>
    </header>
  );
}
