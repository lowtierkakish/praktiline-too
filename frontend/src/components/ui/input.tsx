import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  style,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      style={{
        borderWidth: "1px",
        ...style,
      }}
      className={cn(
        "flex h-11 w-full min-w-0 rounded-md border-solid border-[#e1e5e9] bg-white px-3 py-2 text-sm text-[#222222] placeholder:text-[#767676] transition-colors duration-200 outline-none",
        "focus:border-[#E60023] focus:ring-0 hover:border-[#c1c7cd]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
