import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn("flex gap-4", className)}
    {...props}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "flex items-center justify-center h-5 w-5 rounded-full border border-[#e5eaf2] bg-white outline-none transition-colors duration-150",
      "focus-visible:ring-2 focus-visible:ring-[#2261ff]/30 focus-visible:ring-offset-2",
      "data-[state=checked]:border-[#2261ff]",
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="block h-3 w-3 rounded-full bg-[#2261ff] transition-all" />
    {children}
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
