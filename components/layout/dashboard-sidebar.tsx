"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { TOOL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isMobile, open, setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-start gap-2">
          <div
            className={cn(
              "w-full rounded-2xl border-[3px] border-black bg-yellow p-4 text-black shadow-brutal",
              !open && !isMobile && "px-2 py-3 text-center",
            )}
          >
            <p className="font-display text-lg font-black">{!open && !isMobile ? "DTB" : "DEVTOOLBOX"}</p>
            <p className={cn("text-xs font-black uppercase", !open && !isMobile && "hidden")}>
              Utility Suite V2.0
            </p>
          </div>
          {isMobile ? (
            <Button
              size="icon"
              variant="white"
              aria-label="Close sidebar"
              onClick={() => setOpenMobile(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {TOOL_LINKS.map((item) => {
                const active =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (isMobile) setOpenMobile(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl border-[3px] border-black px-3 py-3 text-left text-sm font-black uppercase transition-transform",
                        active
                          ? "bg-yellow text-black shadow-brutal"
                          : "bg-slate-800 text-slate-100 hover:-translate-y-0.5 hover:bg-slate-700",
                        !open && !isMobile && "justify-center px-2",
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className={cn(!open && !isMobile && "hidden")}>{item.label}</span>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className={cn("rounded-2xl border-[3px] border-black bg-slate-800 p-4", !open && !isMobile && "p-2")}>
          <div className={cn(!open && !isMobile && "hidden")}>
            <Badge variant="green">Pro Tip</Badge>
            <p className="mt-3 text-sm font-semibold text-slate-200">
              Press <span className="font-black text-yellow">Cmd/Ctrl + K</span> to jump between
              tools.
            </p>
            <Button variant="yellow" className="mt-4 w-full">
              Upgrade Pro
            </Button>
          </div>
          {!open && !isMobile ? (
            <Button variant="yellow" size="icon" className="h-10 w-full" aria-label="Upgrade Pro">
              <Sparkles className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
