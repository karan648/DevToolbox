import { SecurityHeadersTool } from "@/components/tools/security-headers-tool";

export default function SecurityHeadersPage() {
  return (
    <section>
      <h1 className="font-display text-5xl font-black">Security Headers Audit</h1>
      <p className="mt-2 text-sm font-semibold text-slate-300">
        Audit enterprise security headers for public URLs and spot high-impact gaps quickly.
      </p>
      <div className="mt-5">
        <SecurityHeadersTool />
      </div>
    </section>
  );
}
