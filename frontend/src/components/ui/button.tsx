import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#E60023] text-white shadow-xs hover:bg-[#d50520] border border-[#E60023]",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-[#E60023] bg-white text-[#E60023] shadow-xs hover:bg-[#fef2f2] hover:text-[#E60023]",
        outlineRed:
          "border border-[#e53e3e] bg-white text-[#e53e3e] shadow-xs hover:bg-[#f9e6e6] hover:text-[#e53e3e] dark:bg-input/30 dark:border-[#e53e3e] dark:hover:bg-[#f9e6e6]",
        secondary: "bg-[#fef2f2] text-[#E60023] shadow-xs hover:bg-[#fef2f2]",
        ghost:
          "hover:bg-[#fef2f2] hover:text-[#E60023] dark:hover:bg-[#fef2f2]",
        link: "text-[#E60023] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
