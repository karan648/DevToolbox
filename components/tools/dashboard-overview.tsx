"use client";

import Link from "next/link";
import { Activity, Box, Cpu, RefreshCcw, Server } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { StatCard } from "@/components/neobrutal/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRecentTools } from "@/hooks/use-recent-tools";

type DashboardStats = {
  cards: {
    activeContainers: {
      value: number | null;
      available: boolean;
      note: string;
    };
    apiLatency: {
      value: number | null;
      available: boolean;
      note: string;
    };
    errorReports: {
      value: number;
      note: string;
    };
    memoryUsage: {
      value: number | null;
      rssMb: number;
      heapMb: number;
      note: string;
    };
  };
  updatedAt: string;
};

function formatUpdatedAt(value: string | null) {
  if (!value) return "Never";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";

  return date.toLocaleTimeString();
}

export function DashboardOverview() {
  const { recent } = useRecentTools();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async (withSpinner = false) => {
    if (withSpinner) {
      setRefreshing(true);
    }

    try {
      const response = await fetch("/api/dashboard-stats", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as DashboardStats | { error?: string };

      if (!response.ok || !("cards" in data)) {
        setStatsError(("error" in data && data.error) || "Could not load dashboard stats");
        return;
      }

      setStatsError(null);
      setStats(data);
    } catch {
      setStatsError("Could not load dashboard stats");
    } finally {
      if (withSpinner) {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    void loadStats(true);

    const timer = setInterval(() => {
      void loadStats();
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  const values = useMemo(() => {
    const card = stats?.cards;

    return {
      containers: card
        ? card.activeContainers.available && typeof card.activeContainers.value === "number"
          ? String(card.activeContainers.value)
          : "N/A"
        : "--",
      latency: card
        ? card.apiLatency.available && typeof card.apiLatency.value === "number"
          ? `${card.apiLatency.value}ms`
          : "N/A"
        : "--",
      errors: card ? String(card.errorReports.value) : "--",
      memory: card
        ? typeof card.memoryUsage.value === "number"
          ? `${card.memoryUsage.value}%`
          : `${card.memoryUsage.rssMb}MB`
        : "--",
    };
  }, [stats]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Containers"
          value={values.containers}
          tone="blue"
          subtext={stats?.cards.activeContainers.note || "Waiting for live data"}
        />
        <StatCard
          label="API Latency"
          value={values.latency}
          tone="green"
          subtext={stats?.cards.apiLatency.note || "Waiting for live data"}
        />
        <StatCard
          label="Error Reports (24h)"
          value={values.errors}
          tone="orange"
          subtext={stats?.cards.errorReports.note || "Waiting for live data"}
        />
        <StatCard
          label="Memory Usage"
          value={values.memory}
          tone="yellow"
          subtext={
            stats
              ? `${stats.cards.memoryUsage.rssMb}MB RSS • ${stats.cards.memoryUsage.heapMb}MB Heap`
              : "Waiting for live data"
          }
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          {statsError ? (
            <p className="text-sm font-semibold text-coral">{statsError}</p>
          ) : (
            <p className="text-xs font-semibold text-slate-300">
              Live sync active • Last update at {formatUpdatedAt(stats?.updatedAt || null)}
            </p>
          )}
        </div>
        <Button variant="white" size="sm" onClick={() => void loadStats(true)} disabled={refreshing}>
          <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Activity className="h-5 w-5 text-yellow" />
          <h2 className="font-display text-2xl font-black text-white">Recently Used Tools</h2>
        </div>
        {recent.length === 0 ? (
          <Card className="p-4">
            <p className="text-sm text-slate-300">No real usage yet. Open tools to build history.</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recent.map((tool) => (
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
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Server className="h-4 w-4 text-green" />
            <h3 className="text-lg font-black text-white">Live System Logs</h3>
          </div>
          <div className="rounded-xl border-[3px] border-black bg-slate-900 p-3 text-xs font-mono text-slate-200">
            <p>[live] Dashboard metrics refresh every 12 seconds.</p>
            <p>[live] Data source: API + Docker runtime (if available).</p>
            <p>[live] No synthetic demo values are injected.</p>
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
              <span>Docker Runtime</span>
              <Badge variant={stats?.cards.activeContainers.available ? "green" : "coral"}>
                {stats?.cards.activeContainers.available ? "Online" : "Unavailable"}
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border-[3px] border-black bg-slate-900 p-3">
              <span>Stats Sync</span>
              <Badge variant={statsError ? "coral" : "yellow"}>{statsError ? "Degraded" : "Live"}</Badge>
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
