"use client";

import Link from "next/link";
import { Activity, Box, Cpu, Server } from "lucide-react";

import { StatCard } from "@/components/neobrutal/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRecentTools } from "@/hooks/use-recent-tools";

export function DashboardOverview() {
  const { recent } = useRecentTools();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active Containers" value="12" tone="blue" subtext="3 from yesterday" />
        <StatCard label="API Latency" value="42ms" tone="green" subtext="Excellent performance" />
        <StatCard label="Build Errors" value="0" tone="orange" subtext="Clean slate" />
        <StatCard label="Memory Usage" value="64%" tone="yellow" subtext="Within safe limits" />
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-5 w-5 text-yellow" />
          <h2 className="font-display text-2xl font-black text-white">Recently Used Tools</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(recent.length > 0
            ? recent
            : [
                { name: "env-manager", path: "/dashboard/env-manager", visitedAt: Date.now() },
                { name: "api-tester", path: "/dashboard/api-tester", visitedAt: Date.now() },
                { name: "error-debugger", path: "/dashboard/error-debugger", visitedAt: Date.now() },
              ]
          ).map((tool) => (
            <Card key={`${tool.path}-${tool.visitedAt}`} className="p-4">
              <Badge variant="yellow" className="w-fit">
                {tool.name}
              </Badge>
              <p className="mt-3 text-sm text-slate-300">
                Open this tool to continue your previous workflow.
              </p>
              <Link href={tool.path}>
                <Button className="mt-4 w-full">Open Tool</Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Server className="h-4 w-4 text-green" />
            <h3 className="text-lg font-black text-white">Live System Logs</h3>
          </div>
          <div className="rounded-xl border-[3px] border-black bg-slate-900 p-3 text-xs font-mono text-slate-200">
            <p>[14:22:01] POST /api/v1/auth - 200 OK</p>
            <p>[14:22:06] WARN nginx-prod high disk I/O</p>
            <p>[14:22:18] GET /health - 200 OK</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Box className="h-4 w-4 text-blue" />
            <h3 className="text-lg font-black text-white">Active Environment</h3>
          </div>
          <div className="space-y-2 text-sm font-bold text-slate-200">
            <div className="flex items-center justify-between rounded-xl border-[3px] border-black bg-slate-900 p-3">
              <span>Postgres</span>
              <Badge variant="green">Connected</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border-[3px] border-black bg-slate-900 p-3">
              <span>Redis</span>
              <Badge variant="blue">Idle</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border-[3px] border-black bg-slate-900 p-3">
              <span>API Cache</span>
              <Badge variant="yellow">Warm</Badge>
            </div>
          </div>
        </Card>
      </section>

      <Card className="flex items-center justify-between p-4">
        <div>
          <p className="text-lg font-black text-white">Need faster builds?</p>
          <p className="text-sm text-slate-300">
            Move to Pro for AI debugging history and longer API request logs.
          </p>
        </div>
        <Button variant="orange">
          <Cpu className="h-4 w-4" /> Upgrade
        </Button>
      </Card>
    </div>
  );
}
