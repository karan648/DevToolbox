"use client";

import { Bug, Sparkles } from "lucide-react";
import { useState } from "react";

import { CodeEditor } from "@/components/tools/code-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Textarea } from "@/components/ui/textarea";

type AiResult = {
  explanation: string;
  rootCause: string;
  suggestedFix: string;
};

export function ErrorDebuggerTool() {
  const [error, setError] = useState(
    "TypeError: Cannot read properties of undefined (reading 'map')",
  );
  const [code, setCode] = useState("const names = users.map((u) => u.name);");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResult | null>(null);
  const [sessions, setSessions] = useState<Array<{ text: string; at: string }>>([]);

  const analyze = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/error-debugger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data as AiResult);
      setSessions((prev) =>
        [{ text: error.slice(0, 70), at: new Date().toLocaleTimeString() }, ...prev].slice(
          0,
          4,
        ),
      );
    } catch {
      setResult({
        explanation: "Could not reach AI provider. Check OPENAI_API_KEY.",
        rootCause: "Missing or invalid key, or provider unavailable.",
        suggestedFix:
          "Configure OPENAI_API_KEY in your env and retry. You can also swap providers via AI_PROVIDER.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="space-y-4 p-4">
        <h2 className="font-display text-2xl font-black text-white">Input Stack Trace</h2>
        <Textarea
          value={error}
          onChange={(event) => setError(event.target.value)}
          className="min-h-[180px]"
        />

        <div className="overflow-hidden rounded-xl border-[3px] border-black">
          <div className="border-b-[3px] border-black bg-slate-900 px-3 py-2 text-xs font-black uppercase text-slate-300">
            Optional Code Context
          </div>
          <CodeEditor value={code} onChange={setCode} language="typescript" height="210px" />
        </div>

        <div className="flex gap-2">
          <Button onClick={analyze} disabled={loading}>
            {loading ? <Sparkles className="h-4 w-4 animate-pulse" /> : <Bug className="h-4 w-4" />}
            Analyze Error
          </Button>
          <Button
            variant="white"
            onClick={() => {
              setError("");
              setCode("");
              setResult(null);
            }}
          >
            Clear
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-black text-white">AI Analysis</h3>
            <Badge variant="green">Ready</Badge>
          </div>

          {result ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border-[3px] border-black bg-white p-3 text-black">
                <p className="text-xs font-black uppercase">Root Cause</p>
                <p className="mt-1 text-sm font-semibold">{result.rootCause}</p>
              </div>
              <div className="rounded-xl border-[3px] border-black bg-slate-900 p-3">
                <p className="text-xs font-black uppercase text-yellow">Explanation</p>
                <p className="mt-1 text-sm text-slate-200">{result.explanation}</p>
              </div>
              <div className="rounded-xl border-[3px] border-black bg-green p-3 text-black">
                <p className="text-xs font-black uppercase">Suggested Fix</p>
                <p className="mt-1 text-sm font-semibold whitespace-pre-wrap">{result.suggestedFix}</p>
              </div>
              <CopyButton
                text={`${result.rootCause}\n\n${result.explanation}\n\n${result.suggestedFix}`}
                label="Copy Fix"
              />
            </div>
          ) : (
            <p className="mt-4 text-sm font-semibold text-slate-300">
              Paste a stack trace and analyze for AI-assisted debugging output.
            </p>
          )}
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-black uppercase text-white">Recent Sessions</h4>
          <div className="mt-3 grid gap-2">
            {sessions.length === 0 ? (
              <p className="text-sm text-slate-300">No sessions yet.</p>
            ) : (
              sessions.map((session, idx) => (
                <div
                  key={`${session.at}-${idx}`}
                  className="rounded-xl border-[3px] border-black bg-slate-900 p-3"
                >
                  <p className="text-xs font-black text-coral">{session.at}</p>
                  <p className="text-sm text-slate-200">{session.text}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
