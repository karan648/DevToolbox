import Link from "next/link";

import { AuthTabsCard } from "@/components/layout/auth-tabs-card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-shell text-white">
      <header className="border-b-[3px] border-black px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <p className="font-display text-2xl font-black">DevToolbox</p>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/">
              <Button size="sm" variant="white">
                Back Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-10 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <div className="rounded-3xl border-[4px] border-black bg-slate-800 p-8 shadow-brutal">
            <h1 className="font-display text-6xl font-black leading-[0.9]">
              Build faster, <span className="bg-yellow px-2 text-black">smarter</span> together.
            </h1>
            <p className="mt-5 text-lg text-slate-300">
              Ship faster with one workspace for APIs, infra commands, transformers, and AI
              debugging.
            </p>
            <div className="mt-6 flex gap-2">
              <span className="rounded-full border-[3px] border-black bg-blue px-3 py-1 text-xs font-black text-black">
                API
              </span>
              <span className="rounded-full border-[3px] border-black bg-green px-3 py-1 text-xs font-black text-black">
                JSON
              </span>
              <span className="rounded-full border-[3px] border-black bg-orange px-3 py-1 text-xs font-black text-black">
                Docker
              </span>
            </div>
          </div>
          <div className="h-60 rounded-3xl border-[4px] border-black bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-8 shadow-brutal">
            <p className="font-display text-4xl font-black text-yellow">TEAM READY</p>
            <p className="mt-2 text-sm text-slate-300">
              Graphic placeholder: onboarding scene / engineering team collaboration.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <AuthTabsCard />
        </div>
      </main>
    </div>
  );
}
