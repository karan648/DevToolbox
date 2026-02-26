import Link from "next/link";
import { ArrowRight, Sparkles, TerminalSquare } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FEATURE_CARDS, PRICING_TIERS } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-shell text-white">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden border-b-[3px] border-black bg-shell px-4 py-16 md:px-6">
          <div className="absolute -left-10 top-20 h-44 w-44 rounded-full border-[3px] border-black bg-yellow/80 blur-2xl" />
          <div className="absolute right-10 top-10 h-40 w-40 rounded-full border-[3px] border-black bg-blue/60 blur-2xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2">
            <div>
              <Badge variant="yellow">V2.0 is now live</Badge>
              <h1 className="mt-5 font-display text-5xl font-black leading-[0.95] text-white md:text-7xl">
                The Developer <span className="bg-yellow px-2 text-black">Toolbox</span> you
                keep open every day.
              </h1>
              <p className="mt-5 max-w-xl text-lg font-semibold text-slate-200">
                All essential utilities for modern developers in one playful neobrutal
                workspace.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/auth/signup">
                  <Button size="lg">
                    Start Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="white" size="lg">
                    Explore Tools
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="overflow-hidden border-[4px] p-4">
              <div className="rounded-xl border-[3px] border-black bg-gradient-to-br from-cyan-200 via-cyan-100 to-emerald-200 p-5">
                <div className="flex items-center justify-between">
                  <Badge variant="blue">Fast Workflow</Badge>
                  <TerminalSquare className="h-6 w-6 text-black" />
                </div>
                <div className="mt-6 h-64 rounded-xl border-[3px] border-black bg-white/80 p-4">
                  <p className="font-display text-2xl font-black text-black">Cartoon Dev Illustration</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    Placeholder for branded artwork from your design pack.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <h2 className="font-display text-4xl font-black">
            Everything you need, <span className="text-blue">nothing you don&apos;t.</span>
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {FEATURE_CARDS.map((feature) => (
              <Card key={feature.title} className="p-4">
                <div className={`h-2 w-16 rounded-full border-[3px] border-black ${feature.color}`} />
                <p className="mt-4 font-display text-xl font-black">{feature.title}</p>
                <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow" />
            <h2 className="font-display text-4xl font-black">
              Simple <span className="bg-green px-2 text-black">Pricing</span>
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PRICING_TIERS.map((tier) => (
              <Card
                key={tier.name}
                className={`p-5 ${tier.featured ? "translate-y-[-4px] border-[4px]" : ""}`}
              >
                <p className="text-sm font-black uppercase text-slate-300">{tier.name}</p>
                <p className="mt-2 font-display text-5xl font-black text-white">{tier.price}</p>
                <p className="mt-2 text-sm text-slate-300">{tier.subtitle}</p>
                <ul className="mt-4 space-y-2 text-sm font-semibold text-slate-200">
                  {tier.features.map((feature) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
                <Link href="/pricing" className="mt-4 block">
                  <Button className="w-full" variant={tier.featured ? "yellow" : "white"}>
                    {tier.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
