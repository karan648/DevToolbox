"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TOOL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-r-[3px] border-black bg-slate-900 p-4 md:w-72">
      <div className="rounded-2xl border-[3px] border-black bg-yellow p-4 text-black shadow-brutal">
        <p className="font-display text-lg font-black">DEVTOOLBOX</p>
        <p className="text-xs font-black uppercase">Utility Suite V2.0</p>
      </div>

      <nav className="mt-6 space-y-3">
        {TOOL_LINKS.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl border-[3px] border-black px-3 py-3 text-sm font-black uppercase transition-transform",
                active
                  ? "bg-yellow text-black shadow-brutal"
                  : "bg-slate-800 text-slate-100 hover:-translate-y-0.5 hover:bg-slate-700",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl border-[3px] border-black bg-slate-800 p-4">
        <Badge variant="green">Pro Tip</Badge>
        <p className="mt-3 text-sm font-semibold text-slate-200">
          Press <span className="font-black text-yellow">Cmd/Ctrl + K</span> to jump between
          tools.
        </p>
        <Button variant="yellow" className="mt-4 w-full">
          Upgrade Pro
        </Button>
      </div>
    </aside>
  );
}
