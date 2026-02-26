import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border-[3px] border-black bg-slate-800/95 shadow-brutal",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export { Card };
