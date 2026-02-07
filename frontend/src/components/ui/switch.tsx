import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

const switchVariants = cva(
    "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "focus-visible:ring-red-500 data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-gray-200",
                destructive:
                    "focus-visible:ring-red-500 data-[state=checked]:bg-red-600 data-[state=unchecked]:bg-gray-200",
                success:
                    "focus-visible:ring-green-500 data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-200",
                warning:
                    "focus-visible:ring-amber-500 data-[state=checked]:bg-amber-600 data-[state=unchecked]:bg-gray-200",
            },
            size: {
                default: "h-6 w-11",
                sm: "h-5 w-9",
                lg: "h-7 w-13",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
)

const thumbVariants = cva(
    "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform",
    {
        variants: {
            size: {
                default: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
                sm: "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
                lg: "h-6 w-6 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0",
            },
        },
        defaultVariants: {
            size: "default",
        },
    },
)

export interface SwitchProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
        VariantProps<typeof switchVariants> {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
}

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
    ({ className, variant, size, checked, onCheckedChange, ...props }, ref) => {
        return (
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                data-state={checked ? "checked" : "unchecked"}
                onClick={() => onCheckedChange?.(!checked)}
                className={cn(
                    switchVariants({ variant, size }),
                    checked ? "bg-red-600" : "bg-gray-200",
                    className,
                )}
                ref={ref}
                {...props}
            >
                <span
                    data-state={checked ? "checked" : "unchecked"}
                    className={cn(
                        thumbVariants({ size }),
                        checked ? "translate-x-5" : "translate-x-0",
                    )}
                />
            </button>
        )
    }
)

Switch.displayName = "Switch"

export { Switch, switchVariants }