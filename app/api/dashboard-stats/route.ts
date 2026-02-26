import { exec } from "node:child_process";
import os from "node:os";
import { promisify } from "node:util";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const execAsync = promisify(exec);

async function getActiveContainerCount() {
  try {
    const { stdout } = await execAsync("docker ps -q");
    const count = stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean).length;

    return { count, available: true };
  } catch {
    return { count: null as number | null, available: false };
  }
}

async function getApiLatencyMs(request: Request) {
  const pingUrl = new URL("/api/ping", request.url).toString();
  const started = Date.now();

  try {
    const response = await fetch(pingUrl, { cache: "no-store" });
    if (!response.ok) {
      return { latencyMs: null as number | null, ok: false };
    }
    return { latencyMs: Date.now() - started, ok: true };
  } catch {
    return { latencyMs: null as number | null, ok: false };
  }
}

function getMemoryMetrics() {
  const memory = process.memoryUsage();
  const totalMem = os.totalmem();

  const rssPercent = totalMem > 0 ? Math.round((memory.rss / totalMem) * 100) : null;
  const rssMb = Math.round(memory.rss / (1024 * 1024));
  const heapMb = Math.round(memory.heapUsed / (1024 * 1024));

  return {
    rssPercent,
    rssMb,
    heapMb,
  };
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [containerData, latencyData, errorReports24h] = await Promise.all([
    getActiveContainerCount(),
    getApiLatencyMs(request),
    prisma.toolUsage.count({
      where: {
        userId: session.user.id,
        toolName: "error-debugger",
        createdAt: {
          gte: dayAgo,
        },
      },
    }),
  ]);

  const memory = getMemoryMetrics();

  return NextResponse.json({
    cards: {
      activeContainers: {
        value: containerData.count,
        available: containerData.available,
        note: containerData.available
          ? "Detected from Docker runtime"
          : "Docker runtime unavailable",
      },
      apiLatency: {
        value: latencyData.latencyMs,
        available: latencyData.ok,
        note: latencyData.ok
          ? "Measured against /api/ping"
          : "Ping endpoint unavailable",
      },
      errorReports: {
        value: errorReports24h,
        note: "Collected from Error Debugger usage in last 24h",
      },
      memoryUsage: {
        value: memory.rssPercent,
        rssMb: memory.rssMb,
        heapMb: memory.heapMb,
        note: "Current server process memory",
      },
    },
    updatedAt: now.toISOString(),
  });
}
