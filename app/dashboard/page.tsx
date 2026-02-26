import { DashboardOverview } from "@/components/tools/dashboard-overview";

export default function DashboardPage() {
  return (
    <section>
      <h1 className="font-display text-6xl font-black tracking-tight">Dashboard</h1>
      <p className="mt-2 text-lg font-semibold text-slate-300">
        &quot;Code is like humor. When you have to explain it, it&apos;s bad.&quot;
      </p>
      <div className="mt-6">
        <DashboardOverview />
      </div>
    </section>
  );
}
