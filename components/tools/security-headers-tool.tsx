"use client";

import { AlertTriangle, ShieldCheck, ShieldOff } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type SecurityHeaderResult = {
  url: string;
  status: number;
  score: number;
  checks: Array<{
    key: string;
    label: string;
    description: string;
    present: boolean;
    value: string;
  }>;
  warnings: string[];
  headers: Record<string, string>;
};

export function SecurityHeadersTool() {
  const [url, setUrl] = useState("https://vercel.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SecurityHeaderResult | null>(null);

  const inspect = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/security-headers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = (await response.json()) as SecurityHeaderResult | { error?: string };

      if (!response.ok || !("checks" in data)) {
        setError(("error" in data && data.error) || "Audit failed");
        setResult(null);
        return;
      }

      setResult(data);
    } catch {
      setError("Could not audit this URL");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <Input value={url} onChange={(event) => setUrl(event.target.value)} />
          <Button onClick={inspect} disabled={loading}>
            {loading ? <LoadingSpinner /> : <ShieldCheck className="h-4 w-4" />} Run Audit
          </Button>
        </div>
        <p className="mt-3 text-sm text-slate-300">
          Checks production security headers used by enterprise security teams and compliance
          reviews.
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-3xl font-black text-white">Security Score</h2>
                <p className="text-sm text-slate-300">{result.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={result.score >= 80 ? "green" : result.score >= 50 ? "yellow" : "coral"}>
                  {result.score}%
                </Badge>
                <Badge variant="blue">HTTP {result.status}</Badge>
                <CopyButton text={JSON.stringify(result, null, 2)} label="Copy JSON" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-display text-xl font-black text-white">Header Checks</h3>
            <div className="mt-3 space-y-2">
              {result.checks.map((check) => (
                <div
                  key={check.key}
                  className="flex items-start justify-between gap-4 rounded-xl border-[3px] border-black bg-slate-900 p-3"
                >
                  <div>
                    <p className="text-sm font-black text-white">{check.label}</p>
                    <p className="text-xs text-slate-300">{check.description}</p>
                    {check.value ? (
                      <p className="mt-1 text-xs text-slate-300 break-all">{check.value}</p>
                    ) : null}
                  </div>
                  {check.present ? (
                    <Badge variant="green">
                      <ShieldCheck className="h-3 w-3" /> Present
                    </Badge>
                  ) : (
                    <Badge variant="coral">
                      <ShieldOff className="h-3 w-3" /> Missing
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-display text-xl font-black text-white">Warnings</h3>
            {result.warnings.length === 0 ? (
              <p className="mt-2 text-sm text-slate-300">No immediate warnings.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm text-slate-200">
                {result.warnings.map((warning) => (
                  <li key={warning} className="rounded-lg border-[3px] border-black bg-slate-900 px-3 py-2">
                    <AlertTriangle className="mr-2 inline h-4 w-4 text-orange" />
                    {warning}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      ) : null}
    </div>
  );
}
