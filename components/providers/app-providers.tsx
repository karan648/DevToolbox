"use client";

import { Toaster } from "sonner";

import { CommandPalette } from "@/components/layout/command-palette";
import { SessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        {children}
        <CommandPalette />
        <Toaster
          position="bottom-right"
          toastOptions={{
            className:
              "!border-[3px] !border-black !rounded-xl !font-semibold !text-black",
            style: {
              background: "#FFD600",
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
