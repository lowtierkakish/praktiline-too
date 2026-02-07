import Image from "next/image";
import { RegisterForm } from "@/components/register-form";

export const metadata = {
  title: "Sign Up - Martin's Project",
  description: "Create a new account on Martin's Project!",
};

export default function Page() {
  return (
    <div className="min-h-screen w-full overflow-hidden flex items-center justify-center relative">
      <div className="absolute inset-0 bg-white/10 z-10"></div>
      <div className="w-full max-w-md p-6 relative z-20">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 p-8 relative overflow-hidden">
          <div className="relative z-10">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
