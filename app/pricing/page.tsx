import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PRICING_TIERS } from "@/lib/constants";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-shell text-white">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="text-center">
          <Badge variant="yellow">Pricing Plans</Badge>
          <h1 className="mt-4 font-display text-6xl font-black tracking-tight">
            Scale your <span className="bg-yellow px-2 text-black">workflow</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Transparent pricing for solo developers, growing startups, and product teams.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <Card
              key={tier.name}
              className={`p-5 ${tier.featured ? "border-[4px] border-black bg-yellow text-black" : ""}`}
            >
              <p className="font-display text-2xl font-black">{tier.name}</p>
              <p className="mt-2 text-5xl font-black">{tier.price}</p>
              <p className="mt-2 text-sm font-semibold opacity-90">{tier.subtitle}</p>
              <ul className="mt-5 space-y-2 text-sm font-semibold">
                {tier.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={tier.featured ? "dark" : "yellow"}
              >
                {tier.cta}
              </Button>
            </Card>
          ))}
        </div>

        <Card className="mt-12 border-[4px] bg-slate-950 p-8 text-center">
          <h2 className="font-display text-5xl font-black">
            Ready to start <span className="text-yellow">building</span>?
          </h2>
          <p className="mt-3 text-slate-300">Join thousands of developers shipping faster.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/auth/signup">
              <Button>Create Account</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="white">View Dashboard</Button>
            </Link>
          </div>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
