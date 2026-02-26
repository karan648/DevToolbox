"use client";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { ToolVisitTracker } from "@/components/layout/tool-visit-tracker";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen overflow-x-hidden bg-shell text-white">
        <div className="flex min-h-screen">
          <DashboardSidebar />
          <SidebarInset>
            <DashboardTopbar />
            <ToolVisitTracker />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
