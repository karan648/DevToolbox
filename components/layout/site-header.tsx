import Link from "next/link";
import { Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { APP_NAME } from "@/lib/constants";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-black bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-lg border-[3px] border-black bg-yellow p-2">
            <Wrench className="h-4 w-4 text-black" />
          </span>
          <div>
            <p className="font-display text-xl font-black tracking-tight text-white">
              {APP_NAME}
            </p>
            <p className="text-[10px] font-black uppercase text-yellow">Utility suite v2.0</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-bold text-slate-200 md:flex">
          <Link href="#features" className="hover:text-yellow">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-yellow">
            Pricing
          </Link>
          <Link href="/dashboard" className="hover:text-yellow">
            Dashboard
          </Link>
          <Link href="/auth/login" className="hover:text-yellow">
            Login
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/auth/signup">
            <Button size="sm" variant="yellow">
              Start Free
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
