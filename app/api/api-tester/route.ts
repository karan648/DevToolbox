import { NextResponse } from "next/server";

import { getSafeServerSession } from "@/lib/auth-session";
import { apiTesterSchema } from "@/lib/validations";
import { logToolUsage } from "@/server/tools/usage";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = apiTesterSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid request" },
        { status: 400 },
      );
    }

    const started = Date.now();
    const response = await fetch(parsed.data.url, {
      method: parsed.data.method,
      headers: parsed.data.headers,
      body:
        parsed.data.method === "GET" || !parsed.data.body
          ? undefined
          : parsed.data.body,
      cache: "no-store",
    });

    const elapsedMs = Date.now() - started;
    const contentType = response.headers.get("content-type") || "";
    const responseText = await response.text();

    let body: unknown = responseText;
    const isJsonLike = contentType.includes("application/json") || contentType.includes("+json");

    if (isJsonLike && responseText) {
      try {
        body = JSON.parse(responseText);
      } catch {
        body = {
          parseError: "Invalid JSON returned by upstream API",
          raw: responseText,
        };
      }
    }

    const session = await getSafeServerSession();
    await logToolUsage({
      userId: session?.user?.id,
      toolName: "api-tester",
      payload: { url: parsed.data.url, method: parsed.data.method },
    });

    return NextResponse.json({
      status: response.status,
      elapsedMs,
      headers: Object.fromEntries(response.headers.entries()),
      body,
      snippet: `curl --location '${parsed.data.url}' --request ${parsed.data.method}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Request failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
