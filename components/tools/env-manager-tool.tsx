"use client";

import { FileJson, FileType2, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { CodeEditor } from "@/components/tools/code-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { downloadTextFile } from "@/lib/utils";

const defaultEnv = `PORT=3000\nDATABASE_URL=postgres://user:pass@localhost:5432/devtoolbox\nNEXTAUTH_SECRET=replace_me\nOPENAI_API_KEY=replace_me`;

type EnvResponse = {
  variables: Array<{ key: string; value: string; issues: string[] }>;
  totals: { count: number; errors: number };
  example: string;
  json: string;
};

export function EnvManagerTool() {
  const [raw, setRaw] = useState(defaultEnv);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EnvResponse | null>(null);

  const runValidation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/env", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Validation failed");
        return;
      }

      setResult(data as EnvResponse);
    } catch {
      setError("Request failed. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b-[3px] border-black bg-slate-900 p-4">
          <h2 className="font-display text-2xl font-black text-white">Input .env</h2>
          <Badge variant="yellow">Raw Text</Badge>
        </div>
        <CodeEditor value={raw} onChange={setRaw} language="shell" height="360px" />
        <div className="flex flex-wrap gap-2 p-4">
          <Button onClick={runValidation} disabled={loading}>
            {loading ? <LoadingSpinner /> : <ShieldCheck className="h-4 w-4" />} Validate
          </Button>
          <Button variant="white" onClick={() => setRaw(defaultEnv)}>
            Reset
          </Button>
          <CopyButton text={raw} label="Copy" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-black text-white">Live Output</h2>
          <Badge variant={result?.totals.errors ? "coral" : "green"}>
            {result ? `${result.totals.count} vars` : "No data"}
          </Badge>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border-[3px] border-black bg-coral p-3 text-sm font-bold text-black">
            {error}
          </p>
        ) : null}

        {result ? (
          <div className="mt-4 space-y-3">
            <div className="space-y-2">
              {result.variables.map((variable) => (
                <div
                  key={variable.key}
                  className="rounded-xl border-[3px] border-black bg-slate-900 p-3"
                >
                  <p className="text-sm font-black text-yellow">{variable.key}</p>
                  <p className="text-xs text-slate-300">{variable.value || "(empty)"}</p>
                  {variable.issues.length > 0 ? (
                    <p className="mt-1 text-xs font-bold text-coral">
                      {variable.issues.join(" • ")}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs font-bold text-green">Looks good</p>
                  )}
                </div>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border-[3px] border-black bg-slate-900 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-black uppercase text-slate-300">.env.example</p>
                  <CopyButton text={result.example} label="Copy" />
                </div>
                <Button
                  variant="blue"
                  size="sm"
                  onClick={() => downloadTextFile(".env.example", result.example)}
                >
                  <FileType2 className="h-4 w-4" /> Download
                </Button>
              </div>
              <div className="rounded-xl border-[3px] border-black bg-slate-900 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-black uppercase text-slate-300">JSON Export</p>
                  <CopyButton text={result.json} label="Copy" />
                </div>
                <Button
                  variant="green"
                  size="sm"
                  onClick={() => downloadTextFile("env.json", result.json)}
                >
                  <FileJson className="h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm font-semibold text-slate-300">
            Validate to detect issues and generate conversion outputs.
          </p>
        )}
      </Card>
    </div>
  );
}
