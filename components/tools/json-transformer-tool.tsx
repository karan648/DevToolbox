"use client";

import { Sparkles } from "lucide-react";
import { useState } from "react";

import { CodeEditor } from "@/components/tools/code-editor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const initialJson = '{\n  "id": 1,\n  "name": "DevToolbox",\n  "active": true\n}';

export function JsonTransformerTool() {
  const [input, setInput] = useState(initialJson);
  const [output, setOutput] = useState("");
  const [target, setTarget] = useState<"typescript" | "zod" | "sql">("typescript");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transform = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/json-transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: input, target }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to transform JSON");
        return;
      }

      setOutput(data.output);
    } catch {
      setError("Transformation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "TypeScript", value: "typescript" },
              { label: "Zod Schema", value: "zod" },
              { label: "SQL Schema", value: "sql" },
            ].map((item) => (
              <Button
                key={item.value}
                variant={target === item.value ? "yellow" : "dark"}
                onClick={() =>
                  setTarget(item.value as "typescript" | "zod" | "sql")
                }
              >
                {item.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="green" onClick={transform} disabled={loading}>
              {loading ? <LoadingSpinner /> : <Sparkles className="h-4 w-4" />} Transform
            </Button>
            <CopyButton text={output || ""} />
          </div>
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="border-b-[3px] border-black bg-slate-900 px-3 py-2 text-xs font-black uppercase text-slate-300">
            Input JSON
          </div>
          <CodeEditor value={input} onChange={setInput} language="json" height="420px" />
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b-[3px] border-black bg-slate-900 px-3 py-2 text-xs font-black uppercase text-slate-300">
            Output
            <span>{target}</span>
          </div>
          {error ? (
            <p className="m-4 rounded-xl border-[3px] border-black bg-coral p-3 text-sm font-bold text-black">
              {error}
            </p>
          ) : (
            <CodeEditor
              value={output || "// Output appears here"}
              onChange={() => {}}
              language={target === "sql" ? "sql" : "typescript"}
              height="420px"
            />
          )}
        </Card>
      </div>
    </div>
  );
}
