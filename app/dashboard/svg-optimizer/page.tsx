import { SvgOptimizerTool } from "@/components/tools/svg-optimizer-tool";

export default function SvgOptimizerPage() {
  return (
    <section>
      <h1 className="font-display text-5xl font-black">SVG Optimizer</h1>
      <p className="mt-2 text-sm font-semibold text-slate-300">
        Compress SVG assets, clean metadata, simplify path data, and export React-ready output.
      </p>
      <div className="mt-5">
        <SvgOptimizerTool />
      </div>
    </section>
  );
}
