"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { RecentTool, ToolName } from "@/types";

type RecentToolsState = {
  recent: RecentTool[];
  visitTool: (tool: { name: ToolName; path: string }) => void;
  clearRecent: () => void;
};

export const useRecentTools = create<RecentToolsState>()(
  persist(
    (set, get) => ({
      recent: [],
      visitTool: ({ name, path }) => {
        const current = get().recent.filter((item) => item.path !== path);
        set({
          recent: [{ name, path, visitedAt: Date.now() }, ...current].slice(0, 6),
        });
      },
      clearRecent: () => set({ recent: [] }),
    }),
    {
      name: "devtoolbox-recent-tools",
    },
  ),
);
