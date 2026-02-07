import React from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { SettingsIcon, ArrowLeft } from "lucide-react";

export const LogoIcon = () => (
  <div className="relative flex h-6 w-6 items-center justify-center rounded-xl border border-[#E1F0FF] bg-white shadow-sm">
    <svg
      width="14"
      height="14"
      viewBox="0 0 22 26"
      fill="none"
      className="scale-75"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.147205 23.8903C-0.258152 24.5567 0.221558 25.41 1.00156 25.41H5.47151C5.82378 25.41 6.15007 25.2246 6.33046 24.9221L10.8758 17.2976C10.9008 17.2556 10.9461 17.2299 10.995 17.2299C11.0437 17.2299 11.0888 17.2554 11.1139 17.2972L15.6937 24.9248C15.8745 25.2258 16.1999 25.41 16.551 25.41H21.3741C22.1612 25.41 22.6398 24.5427 22.2202 23.8768L15.2566 12.827C15.2415 12.803 15.2335 12.7752 15.2335 12.7469C15.2335 12.7181 15.2417 12.69 15.2572 12.6658L22.2692 1.72768C22.6959 1.0621 22.2179 0.187988 21.4274 0.187988H16.74C16.3719 0.187988 16.0336 0.390169 15.8593 0.714319L11.591 8.65033C11.5629 8.70257 11.5084 8.73515 11.4491 8.73515C11.39 8.73515 11.3356 8.70277 11.3074 8.65078L9.95448 6.15421H2.92729L6.90324 12.588C6.92139 12.6174 6.931 12.6512 6.931 12.6857C6.931 12.7198 6.92163 12.7532 6.90393 12.7823L0.147205 23.8903ZM1.08383 3.17116H8.33789L7.00497 0.711531C6.83015 0.388935 6.49269 0.187988 6.12577 0.187988H1.03381C0.250652 0.187988 -0.228564 1.04747 0.183142 1.71368L1.08383 3.17116Z"
        fill="url(#xGradient)"
      />
      <defs>
        <linearGradient id="xGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#21ACE1" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

interface NavSwitcherProps {
  workspaceName?: string;
  className?: string;
  onClick?: () => void;
}

function NavSwitcher({
  workspaceName = "Workspace Name",
  className,
  onClick,
}: NavSwitcherProps) {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div
      className={cn(
        "relative isolate flex items-center",
        "h-[42px] w-[214px]",
        "rounded-[32px] border border-[#F3F7F9] bg-[#F3F7F9]",
        "shadow-[0px_0px_10px_rgba(211,216,223,0.3)]",
        "cursor-pointer overflow-hidden",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex w-full items-center px-2 py-1">
        <motion.div
          className="shrink-0"
          animate={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowLeft className="shrink-0" size={16} />
        </motion.div>

        <motion.div
          className="flex h-10 items-center gap-2 rounded-[32px] bg-white px-2 py-2"
          animate={{
            width: "188px",
            x: -20,
          }}
          transition={{ duration: 0.25, type: "tween" }}
        >
          <LogoIcon />
          <span className="max-w-[112px] truncate font-['Noto_Sans'] text-sm leading-5 font-medium text-[#031116] select-none">
            {workspaceName}
          </span>
        </motion.div>

        <motion.div
          className="shrink-0"
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <SettingsIcon size={16} />
        </motion.div>
      </div>
    </div>
  );
}

export default NavSwitcher;
