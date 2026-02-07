import clsx from "clsx";
import { Loader2 } from "lucide-react";
import React from "react";
import { Trio } from "ldrs/react";
import "ldrs/react/Trio.css";

export function Loader() {
  return (
    <div className="flex justify-center items-center h-full">
      <Trio size={30} speed={1.3} color="#E60023" />
    </div>
  );
}

export function LoaderTrioRed() {
  return (
    <div className="flex justify-center items-center h-full">
      <Trio size={20} speed={1.3} color="#E60023" />
    </div>
  );
}

export function LoaderTrio() {
  return (
    <div className="flex justify-center items-center h-full">
      <Trio size={20} speed={1.3} color="#E60023" />
    </div>
  );
}

export default function LoaderCustom({
  normalize,
  size = "small",
}: {
  normalize?: boolean;
  size?: "small" | "medium" | "big" | "ultrasmall";
}) {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Loader2
        className={clsx("animate-spin text-gray-100", {
          "text-gray-500": normalize,
          "h-4 w-4": size === "ultrasmall",
          "h-6 w-6": size === "small",
          "h-12 w-12": size === "medium",
          "h-18 w-18": size === "big",
        })}
      />
    </div>
  );
}
