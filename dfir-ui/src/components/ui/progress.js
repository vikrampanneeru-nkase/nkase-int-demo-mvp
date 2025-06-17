"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
const Progress = React.forwardRef(({ className, value, indicatorClassName, ...props }, ref) => (_jsx(ProgressPrimitive.Root, { ref: ref, className: cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className), ...props, children: _jsx(ProgressPrimitive.Indicator, { className: cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName), style: { transform: `translateX(-${100 - (value || 0)}%)` } }) })));
Progress.displayName = ProgressPrimitive.Root.displayName;
export { Progress };
