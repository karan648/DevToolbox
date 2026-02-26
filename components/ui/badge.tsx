import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-[3px] border-black px-3 py-0.5 text-xs font-black uppercase",
  {
    variants: {
      variant: {
        yellow: "bg-yellow text-black",
        green: "bg-green text-black",
        blue: "bg-blue text-black",
        coral: "bg-coral text-black",
        dark: "bg-slate-800 text-white",
      },
    },
    defaultVariants: {
      variant: "yellow",
    },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
