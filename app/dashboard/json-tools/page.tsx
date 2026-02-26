import { JsonTransformerTool } from "@/components/tools/json-transformer-tool";

export default function JsonToolsPage() {
  return (
    <section>
      <h1 className="font-display text-5xl font-black">JSON / Data Transformer</h1>
      <p className="mt-2 text-sm font-semibold text-slate-300">
        Convert raw JSON into TypeScript interfaces, Zod schemas, or SQL table definitions.
      </p>
      <div className="mt-5">
        <JsonTransformerTool />
      </div>
    </section>
  );
}
