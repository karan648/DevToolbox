import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  tone,
  subtext,
}: {
  label: string;
  value: string;
  tone: "yellow" | "green" | "blue" | "orange";
  subtext?: string;
}) {
  const toneClass = {
    yellow: "bg-yellow",
    green: "bg-green",
    blue: "bg-blue",
    orange: "bg-orange",
  }[tone];

  return (
    <div className={cn("rounded-xl border-[3px] border-black p-4 shadow-brutal", toneClass)}>
      <p className="text-xs font-black uppercase">{label}</p>
      <p className="mt-2 text-4xl font-black tracking-tight">{value}</p>
      {subtext ? <p className="mt-2 text-xs font-semibold">{subtext}</p> : null}
    </div>
  );
}
