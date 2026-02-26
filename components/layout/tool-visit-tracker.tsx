"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { useRecentTools } from "@/hooks/use-recent-tools";
import type { ToolName } from "@/types";

const mapPathToTool = (pathname: string): { name: ToolName; path: string } => {
  if (pathname.startsWith("/dashboard/env-manager")) {
    return { name: "env-manager", path: "/dashboard/env-manager" };
  }
  if (pathname.startsWith("/dashboard/api-tester")) {
    return { name: "api-tester", path: "/dashboard/api-tester" };
  }
  if (pathname.startsWith("/dashboard/json-tools")) {
    return { name: "json-tools", path: "/dashboard/json-tools" };
  }
  if (pathname.startsWith("/dashboard/error-debugger")) {
    return { name: "error-debugger", path: "/dashboard/error-debugger" };
  }
  if (pathname.startsWith("/dashboard/docker-builder")) {
    return { name: "docker-builder", path: "/dashboard/docker-builder" };
  }
  if (pathname.startsWith("/dashboard/repo-analyzer")) {
    return { name: "repo-analyzer", path: "/dashboard/repo-analyzer" };
  }
  if (pathname.startsWith("/dashboard/security-headers")) {
    return { name: "security-headers", path: "/dashboard/security-headers" };
  }
  if (pathname.startsWith("/dashboard/jwt-inspector")) {
    return { name: "jwt-inspector", path: "/dashboard/jwt-inspector" };
  }
  if (pathname.startsWith("/dashboard/svg-optimizer")) {
    return { name: "svg-optimizer", path: "/dashboard/svg-optimizer" };
  }
  if (pathname.startsWith("/dashboard/settings")) {
    return { name: "settings", path: "/dashboard/settings" };
  }
  return { name: "dashboard", path: "/dashboard" };
};

export function ToolVisitTracker() {
  const pathname = usePathname();
  const visitTool = useRecentTools((state) => state.visitTool);

  useEffect(() => {
    const mapped = mapPathToTool(pathname);
    visitTool(mapped);
  }, [pathname, visitTool]);

  return null;
}
