import { JwtInspectorTool } from "@/components/tools/jwt-inspector-tool";

export default function JwtInspectorPage() {
  return (
    <section>
      <h1 className="font-display text-5xl font-black">JWT Inspector</h1>
      <p className="mt-2 text-sm font-semibold text-slate-300">
        Decode and validate JWT claims for faster authentication debugging.
      </p>
      <div className="mt-5">
        <JwtInspectorTool />
      </div>
    </section>
  );
}
