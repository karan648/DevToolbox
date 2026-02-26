"use client";

import { AlertTriangle, GitBranch, PlayCircle, SearchCode, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const demoRepo = "https://github.com/vercel/next.js";

type RepoAnalysis = {
  repo: {
    fullName: string;
    description: string;
    stars: number;
    primaryLanguage: string;
    defaultBranch: string;
    url: string;
  };
  howToRun: string[];
  dependencies: string[];
  envVariables: string[];
  possibleErrors: string[];
  techStack: string[];
  scannedFiles: string[];
};

function ListCard({
  title,
  icon,
  items,
  emptyText,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  emptyText: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-display text-xl font-black text-white">{title}</h3>
        </div>
        <CopyButton text={items.join("\n")} label="Copy" />
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-300">{emptyText}</p>
      ) : (
        <ul className="mt-3 max-h-[280px] space-y-2 overflow-auto pr-1 text-sm text-slate-200">
          {items.map((item) => (
            <li key={item} className="rounded-lg border-[2px] border-black bg-slate-900 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function RepoAnalyzerTool() {
  const [repoUrl, setRepoUrl] = useState(demoRepo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RepoAnalysis | null>(null);

  const summaryText = useMemo(() => {
    if (!result) return "";
    return [
      `Repository: ${result.repo.fullName}`,
      `How to run:\n${result.howToRun.join("\n")}`,
      `Tech stack: ${result.techStack.join(", ")}`,
      `Env variables: ${result.envVariables.join(", ")}`,
      `Possible errors:\n${result.possibleErrors.join("\n")}`,
    ].join("\n\n");
  }, [result]);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/repo-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      const data = (await response.json()) as RepoAnalysis | { error?: string };

      if (!response.ok || !("repo" in data)) {
        setError(("error" in data && data.error) || "Analysis failed");
        setResult(null);
        return;
      }

      setResult(data);
    } catch {
      setError("Could not analyze repository");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <Input
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
            placeholder="https://github.com/org/repo"
          />
          <Button onClick={analyze} disabled={loading}>
            {loading ? <LoadingSpinner /> : <SearchCode className="h-4 w-4" />}
            Analyze Repo
          </Button>
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-300">
          Paste any public GitHub repo and get setup instructions, dependencies, env keys,
          potential errors, and stack detection. Companies love this for onboarding.
        </p>
      </Card>

      {error ? (
        <Card className="border-[4px] bg-coral p-4 text-black">
          <p className="font-black">{error}</p>
        </Card>
      ) : null}

      {result ? (
        <>
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-3xl font-black text-white">{result.repo.fullName}</h2>
                <p className="mt-1 text-sm text-slate-300">{result.repo.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="yellow">⭐ {result.repo.stars}</Badge>
                <Badge variant="blue">{result.repo.primaryLanguage}</Badge>
                <Badge variant="green">{result.repo.defaultBranch}</Badge>
                <CopyButton text={summaryText} label="Copy Summary" />
              </div>
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <ListCard
              title="How To Run"
              icon={<PlayCircle className="h-5 w-5 text-yellow" />}
              items={result.howToRun}
              emptyText="No run commands inferred. Check README manually."
            />
            <ListCard
              title="Tech Stack"
              icon={<GitBranch className="h-5 w-5 text-blue" />}
              items={result.techStack}
              emptyText="Stack not detected from common files."
            />
            <ListCard
              title="Dependencies"
              icon={<Sparkles className="h-5 w-5 text-green" />}
              items={result.dependencies}
              emptyText="No common manifest dependencies detected."
            />
            <ListCard
              title="Env Variables Needed"
              icon={<SearchCode className="h-5 w-5 text-coral" />}
              items={result.envVariables}
              emptyText="No env variables discovered from scanned files."
            />
          </div>

          <ListCard
            title="Possible Errors"
            icon={<AlertTriangle className="h-5 w-5 text-orange" />}
            items={result.possibleErrors}
            emptyText="No major setup risks detected from static analysis."
          />

          <Card className="p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-xl font-black text-white">Scanned Files</h3>
              <CopyButton text={result.scannedFiles.join("\n")} />
            </div>
            <p className="mt-2 text-xs text-slate-300">{result.scannedFiles.join(" • ")}</p>
          </Card>
        </>
      ) : null}
    </div>
  );
}
