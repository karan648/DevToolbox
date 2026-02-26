import { ApiTesterTool } from "@/components/tools/api-tester-tool";

export default function ApiTesterPage() {
  return (
    <section>
      <h1 className="font-display text-5xl font-black">API Tester</h1>
      <p className="mt-2 text-sm font-semibold text-slate-300">
        Compose requests, run endpoint checks, inspect response payloads, and copy snippets.
      </p>
      <div className="mt-5">
        <ApiTesterTool />
      </div>
    </section>
  );
}
