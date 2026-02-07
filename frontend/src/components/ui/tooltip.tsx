"use client";
import * as React from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  className,
}: TooltipProps) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Content
          side={side}
          className={`z-50 px-3 py-2 rounded-lg bg-white/80 backdrop text-[#010d39] text-xs max-w-xs break-words ${
            className || ""
          }`}
        >
          {content}
        </RadixTooltip.Content>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
