"use client";

import { Plus, Send } from "lucide-react";
import { useMemo, useState } from "react";

import { CodeEditor } from "@/components/tools/code-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type HeaderRow = { key: string; value: string };

type ApiResult = {
  status: number;
  elapsedMs: number;
  body: unknown;
  snippet: string;
};

export function ApiTesterTool() {
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/todos/1");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState<HeaderRow[]>([
    { key: "Content-Type", value: "application/json" },
  ]);
  const [body, setBody] = useState("{}");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const responseText = useMemo(
    () => (result ? JSON.stringify(result.body, null, 2) : ""),
    [result],
  );

  const runRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      const parsedHeaders = Object.fromEntries(
        headers.filter((item) => item.key).map((item) => [item.key, item.value]),
      );

      const response = await fetch("/api/api-tester", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, method, headers: parsedHeaders, body }),
      });

      const data = await response.json();

      if (!response.ok) {
        const detail = typeof data.detail === "string" ? data.detail : "";
        setError(detail ? `${data.error || "Request failed"}: ${detail}` : data.error || "Request failed");
        return;
      }

      setResult(data as ApiResult);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[110px_1fr_110px]">
          <select
            value={method}
            onChange={(event) => setMethod(event.target.value)}
            className="h-11 rounded-xl border-[3px] border-black bg-slate-900 px-3 text-sm font-black text-yellow"
          >
            {[
              "GET",
              "POST",
              "PUT",
              "PATCH",
              "DELETE",
            ].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <Input value={url} onChange={(event) => setUrl(event.target.value)} />
          <Button onClick={runRequest} disabled={loading}>
            {loading ? <LoadingSpinner /> : <Send className="h-4 w-4" />} Send
          </Button>
        </div>

        <div className="mt-4 rounded-xl border-[3px] border-black bg-slate-900 p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-black uppercase text-slate-200">Headers</p>
            <Button
              size="sm"
              variant="white"
              onClick={() => setHeaders((prev) => [...prev, { key: "", value: "" }])}
            >
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {headers.map((header, index) => (
              <div className="grid grid-cols-2 gap-2" key={`${header.key}-${index}`}>
                <Input
                  placeholder="Header key"
                  value={header.key}
                  onChange={(event) =>
                    setHeaders((prev) =>
                      prev.map((item, current) =>
                        current === index ? { ...item, key: event.target.value } : item,
                      ),
                    )
                  }
                />
                <Input
                  placeholder="Header value"
                  value={header.value}
                  onChange={(event) =>
                    setHeaders((prev) =>
                      prev.map((item, current) =>
                        current === index ? { ...item, value: event.target.value } : item,
                      ),
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border-[3px] border-black">
          <div className="border-b-[3px] border-black bg-slate-900 px-3 py-2 text-xs font-black uppercase text-slate-300">
            Body (JSON)
          </div>
          <CodeEditor value={body} onChange={setBody} language="json" height="220px" />
        </div>

        {result?.snippet ? (
          <div className="mt-4 rounded-xl border-[3px] border-black bg-slate-900 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-black uppercase text-slate-300">Code Snippet (cURL)</p>
              <CopyButton text={result.snippet} />
            </div>
            <pre className="overflow-x-auto text-xs text-slate-200">{result.snippet}</pre>
          </div>
        ) : null}
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b-[3px] border-black bg-slate-900 px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-xl font-black text-white">Response</h3>
            {result ? (
              <Badge variant={result.status < 400 ? "green" : "coral"}>{result.status}</Badge>
            ) : null}
          </div>
          {result ? <Badge variant="blue">{result.elapsedMs}ms</Badge> : null}
        </div>

        {error ? (
          <p className="m-4 rounded-xl border-[3px] border-black bg-coral p-3 text-sm font-bold text-black">
            {error}
          </p>
        ) : (
          <CodeEditor
            value={responseText || "// Send request to inspect response"}
            onChange={() => {}}
            language="json"
            height="520px"
          />
        )}
      </Card>
    </div>
  );
}
