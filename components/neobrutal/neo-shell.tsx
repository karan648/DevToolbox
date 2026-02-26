import { cn } from "@/lib/utils";

export function NeoShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border-[3px] border-black bg-slate-900/90 p-6 shadow-brutal",
        className,
      )}
    >
      {children}
    </div>
  );
}
