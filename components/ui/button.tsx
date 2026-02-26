"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl border-[3px] border-black font-extrabold uppercase tracking-wide transition-transform duration-150 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        yellow: "bg-yellow text-black shadow-brutal hover:-translate-y-0.5",
        blue: "bg-blue text-black shadow-brutal hover:-translate-y-0.5",
        green: "bg-green text-black shadow-brutal hover:-translate-y-0.5",
        coral: "bg-coral text-black shadow-brutal hover:-translate-y-0.5",
        orange: "bg-orange text-black shadow-brutal hover:-translate-y-0.5",
        dark: "bg-slate-800 text-white shadow-brutal hover:-translate-y-0.5",
        ghost:
          "bg-transparent text-foreground shadow-none hover:bg-white/10 hover:text-foreground",
        white: "bg-white text-black shadow-brutal hover:-translate-y-0.5",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-6 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "yellow",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
