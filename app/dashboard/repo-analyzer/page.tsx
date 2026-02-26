import { RepoAnalyzerTool } from "@/components/tools/repo-analyzer-tool";

export default function RepoAnalyzerPage() {
  return (
    <section>
      <h1 className="font-display text-5xl font-black">Repo Analyzer</h1>
      <p className="mt-2 text-sm font-semibold text-slate-300">
        Paste a GitHub repository and get run steps, dependencies, env requirements, risk flags,
        and stack detection in one report.
      </p>
      <div className="mt-5">
        <RepoAnalyzerTool />
      </div>
    </section>
  );
}
