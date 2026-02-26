"use client";

import { Bell, ChevronDown, Command, Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardTopbar() {
  const { data } = useSession();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-black bg-slate-900 px-4 py-3 md:px-6">
      <div className="relative min-w-[240px] flex-1 md:max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          readOnly
          value="Search tools or commands... (Ctrl + K)"
          className="cursor-pointer bg-slate-800 pl-9 text-xs font-bold text-slate-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button size="icon" variant="white" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 rounded-xl border-[3px] border-black bg-slate-800 px-2 py-1">
          <div className="h-8 w-8 rounded-full border-[3px] border-black bg-yellow" />
          <div className="hidden text-right md:block">
            <p className="text-xs font-black text-white">{data?.user?.name || "Developer"}</p>
            <p className="text-[10px] font-bold uppercase text-slate-400">
              {data?.user?.plan || "FREE"} plan
            </p>
          </div>
          <details className="relative">
            <summary className="list-none cursor-pointer text-slate-300">
              <ChevronDown className="h-4 w-4" />
            </summary>
            <div className="absolute right-0 top-8 w-44 rounded-xl border-[3px] border-black bg-slate-900 p-2 shadow-brutal">
              <button
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold text-slate-200 hover:bg-slate-800"
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
              >
                <Command className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
