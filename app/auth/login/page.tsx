import Link from "next/link";

import { AuthForm } from "@/components/layout/auth-form";
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
              The neobrutal workspace for APIs, env files, JSON transforms, and AI debugging.
            </p>
          </div>
          <div className="h-60 rounded-3xl border-[4px] border-black bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 p-8 shadow-brutal">
            <p className="font-display text-4xl font-black text-yellow">JOIN THE CLUB</p>
            <p className="mt-2 text-sm text-slate-300">Cartoon workspace image placeholder.</p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <AuthForm mode="login" />
        </div>
      </main>
    </div>
  );
}
