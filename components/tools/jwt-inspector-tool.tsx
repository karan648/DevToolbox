"use client";

import { Clock3, KeyRound, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Textarea } from "@/components/ui/textarea";

type ParsedToken = {
  error: string;
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  isEncrypted: boolean;
};

function normalizeTokenInput(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const withoutAuthPrefix = trimmed.replace(/^authorization:\s*/i, "").trim();
  const withoutBearer = withoutAuthPrefix.replace(/^bearer\s+/i, "").trim();

  const firstCandidate = withoutBearer
    .split(/\s+/)
    .find((segment) => segment.includes("."));

  return (firstCandidate || withoutBearer).trim();
}

function decodeBase64Url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const decoded = atob(padded);
  const bytes = Array.from(decoded).map((char) => char.charCodeAt(0));
  return new TextDecoder().decode(new Uint8Array(bytes));
}

export function JwtInspectorTool() {
  const [token, setToken] = useState("");

  const parsed = useMemo<ParsedToken>(() => {
    const normalized = normalizeTokenInput(token);

    if (!normalized) {
      return {
        error: "",
        header: null,
        payload: null,
        isEncrypted: false,
      };
    }

    const parts = normalized.split(".").filter(Boolean);

    if (parts.length < 3) {
      return {
        error: "Invalid token format. Expected JWT with 3 parts.",
        header: null,
        payload: null,
        isEncrypted: false,
      };
    }

    try {
      const header = JSON.parse(decodeBase64Url(parts[0])) as Record<string, unknown>;

      if (parts.length === 5) {
        return {
          error:
            "Encrypted JWE token detected. Header is decoded, payload cannot be inspected without decryption key.",
          header,
          payload: null,
          isEncrypted: true,
        };
      }

      if (parts.length !== 3) {
        return {
          error: `Unsupported token segment count (${parts.length}).`,
          header,
          payload: null,
          isEncrypted: false,
        };
      }

      const payload = JSON.parse(decodeBase64Url(parts[1])) as Record<string, unknown>;

      return { error: "", header, payload, isEncrypted: false };
    } catch {
      return {
        error:
          "Could not decode token. If you pasted 'Bearer <token>', that's supported; otherwise token may be malformed.",
        header: null,
        payload: null,
        isEncrypted: false,
      };
    }
  }, [token]);

  const expirationState = useMemo(() => {
    const exp = parsed.payload?.exp;
    if (typeof exp !== "number") return "No exp claim";

    const nowSeconds = Math.floor(Date.now() / 1000);
    if (exp <= nowSeconds) return "Expired";

    const mins = Math.round((exp - nowSeconds) / 60);
    return `Valid (${mins} min left)`;
  }, [parsed.payload]);

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <h2 className="font-display text-2xl font-black text-white">JWT Inspector</h2>
        <p className="mt-2 text-sm text-slate-300">
          Decode JWT header/payload instantly and verify expiration claims. Useful for debugging
          auth flows in production incidents.
        </p>
        <Textarea
          className="mt-3 min-h-[140px]"
          placeholder="Paste JWT token or Bearer token..."
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="white" onClick={() => setToken("")}>Clear</Button>
          <CopyButton text={token} label="Copy Token" />
        </div>
      </Card>

      {parsed.error ? (
        <Card className="border-[4px] bg-coral p-4 text-black">
          <ShieldAlert className="mr-2 inline h-4 w-4" />
          <span className="font-black">{parsed.error}</span>
        </Card>
      ) : null}

      {parsed.payload && !parsed.isEncrypted ? (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-yellow" />
            <h3 className="font-display text-xl font-black text-white">Token Status</h3>
            <Badge
              variant={
                expirationState.startsWith("Expired")
                  ? "coral"
                  : expirationState.startsWith("Valid")
                    ? "green"
                    : "blue"
              }
            >
              {expirationState}
            </Badge>
          </div>
        </Card>
      ) : null}

      {parsed.header || parsed.payload ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {parsed.header ? (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-black text-white">
                  <KeyRound className="mr-2 inline h-5 w-5 text-blue" /> Header
                </h3>
                <CopyButton text={JSON.stringify(parsed.header, null, 2)} label="Copy" />
              </div>
              <pre className="mt-3 overflow-auto rounded-xl border-[3px] border-black bg-slate-900 p-3 text-xs text-slate-200">
                {JSON.stringify(parsed.header, null, 2)}
              </pre>
            </Card>
          ) : null}

          {parsed.payload ? (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-black text-white">
                  <KeyRound className="mr-2 inline h-5 w-5 text-green" /> Payload
                </h3>
                <CopyButton text={JSON.stringify(parsed.payload, null, 2)} label="Copy" />
              </div>
              <pre className="mt-3 overflow-auto rounded-xl border-[3px] border-black bg-slate-900 p-3 text-xs text-slate-200">
                {JSON.stringify(parsed.payload, null, 2)}
              </pre>
            </Card>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
