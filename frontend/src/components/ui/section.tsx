'use client'

import React, { useState } from "react"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { getAnimation } from "@/lib/animations"
import { Badge } from "@/components/ui/badge"

const sectionVariants = cva(
    "mx-auto w-full rounded-lg border bg-white ",
)

const sectionHeaderVariants = cva(
    "group flex cursor-pointer items-center justify-between p-4",
    {
        variants: {
            variant: {
                default: getAnimation("hoverBlue"),
                danger: "transition-colors duration-200 ease-out hover:bg-red-50",
            },
            isExpanded: {
                true: "rounded-t-lg",
                false: "rounded-lg",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

const sectionIconContainerVariants = cva(
    "flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all",
    {
        variants: {
            variant: {
                default: "group-hover:bg-blue-50 group-hover:text-blue-600",
                danger: "group-hover:bg-red-50 group-hover:text-red-600",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

const sectionContentVariants = cva(
    "overflow-hidden rounded-b-lg border-t bg-gray-50 p-6 transition-all duration-300 ease-out",
    {
        variants: {
            isExpanded: {
                true: "max-h-max opacity-100",
                false: "max-h-0 py-0 opacity-0",
            },
        },
    },
)

export interface SectionProps
    extends VariantProps<typeof sectionHeaderVariants> {
    title: string
    icon: React.ElementType
    description?: string
    children: React.ReactNode
    badge?: string
    badgeVariant?: VariantProps<typeof Badge>["variant"]
    badgeClassName?: string
    defaultExpanded?: boolean
    className?: string
}

export function Section({
    title,
    icon,
    description,
    children,
    badge,
    badgeVariant = "secondary",
    badgeClassName,
    defaultExpanded = false,
    variant,
    className,
}: SectionProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)
    const IconElement = icon

    return (
        <div
            className={cn(sectionVariants(), getAnimation("fadeIn"), className)}
        >
            <div
                className={cn(sectionHeaderVariants({ variant, isExpanded }))}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div
                        className={cn(
                            sectionIconContainerVariants({ variant }),
                        )}
                    >
                        <IconElement
                            className={cn("h-6 w-6", getAnimation("iconHover"))}
                        />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            {" "}
                            <h3 className="font-medium text-gray-900">
                                {title}
                            </h3>
                            {badge && (
                                <Badge
                                    variant={badgeVariant}
                                    className={cn(
                                        variant === "default" &&
                                            "bg-blue-100 text-blue-700",
                                        variant === "danger" &&
                                            "bg-red-100 text-red-700",
                                        badgeClassName,
                                    )}
                                >
                                    {badge}
                                </Badge>
                            )}
                        </div>
                        {description && (
                            <p className="text-sm text-gray-500">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronUpIcon
                        className={cn(
                            "h-5 w-5 text-gray-400",
                            getAnimation("hoverScale"),
                        )}
                    />
                ) : (
                    <ChevronDownIcon
                        className={cn(
                            "h-5 w-5 text-gray-400",
                            getAnimation("hoverScale"),
                        )}
                    />
                )}
            </div>
            <div className={cn(sectionContentVariants({ isExpanded }))}>
                {children}
            </div>
        </div>
    )
}
