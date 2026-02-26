import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-xl border-[3px] border-black bg-slate-900 px-3 py-2 text-sm font-medium text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow/70",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
