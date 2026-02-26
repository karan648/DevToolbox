import { EnvManagerTool } from "@/components/tools/env-manager-tool";

export default function EnvManagerPage() {
  return (
    <section>
      <h1 className="font-display text-5xl font-black">ENV Manager</h1>
      <p className="mt-2 text-sm font-semibold text-slate-300">
        Validate syntax, detect issues, and generate `.env.example` plus JSON output.
      </p>
      <div className="mt-5">
        <EnvManagerTool />
      </div>
    </section>
  );
}
