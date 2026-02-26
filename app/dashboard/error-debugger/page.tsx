import { ErrorDebuggerTool } from "@/components/tools/error-debugger-tool";

export default function ErrorDebuggerPage() {
  return (
    <section>
      <h1 className="font-display text-5xl font-black">
        Error <span className="text-yellow">Debugger</span>
      </h1>
      <p className="mt-2 text-sm font-semibold text-slate-300">
        Paste stack traces and optional code snippets for AI-assisted root-cause analysis.
      </p>
      <div className="mt-5">
        <ErrorDebuggerTool />
      </div>
    </section>
  );
}
