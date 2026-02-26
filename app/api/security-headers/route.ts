import { NextResponse } from "next/server";

import { getSafeServerSession } from "@/lib/auth-session";
import { securityHeadersSchema } from "@/lib/validations";
import { logToolUsage } from "@/server/tools/usage";

const REQUIRED_HEADERS = [
  {
    key: "strict-transport-security",
    label: "Strict-Transport-Security",
    description: "Enforces HTTPS over time.",
  },
  {
    key: "content-security-policy",
    label: "Content-Security-Policy",
    description: "Mitigates XSS and injection attacks.",
  },
  {
    key: "x-content-type-options",
    label: "X-Content-Type-Options",
    description: "Prevents MIME type sniffing.",
  },
  {
    key: "x-frame-options",
    label: "X-Frame-Options",
    description: "Prevents clickjacking in iframes.",
  },
  {
    key: "referrer-policy",
    label: "Referrer-Policy",
    description: "Controls referrer leakage.",
  },
  {
    key: "permissions-policy",
    label: "Permissions-Policy",
    description: "Restricts browser capabilities.",
  },
];

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = securityHeadersSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid URL" },
        { status: 400 },
      );
    }

    const targetUrl = parsed.data.url;
    const response = await fetch(targetUrl, {
      method: "GET",
      cache: "no-store",
      redirect: "follow",
      headers: {
        "User-Agent": "DevToolbox-SecurityHeaders",
      },
    });

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const checks = REQUIRED_HEADERS.map((header) => {
      const value = responseHeaders[header.key];
      return {
        ...header,
        present: Boolean(value),
        value: value || "",
      };
    });

    const presentCount = checks.filter((check) => check.present).length;
    const score = Math.round((presentCount / REQUIRED_HEADERS.length) * 100);

    const warnings: string[] = [];
    if (!targetUrl.startsWith("https://")) {
      warnings.push("Target URL is not HTTPS. Security score is limited.");
    }
    if (response.status >= 400) {
      warnings.push(`Endpoint returned HTTP ${response.status}.`);
    }
    if (!responseHeaders["content-security-policy"]) {
      warnings.push("Missing CSP can increase XSS risk.");
    }

    const session = await getSafeServerSession();
    await logToolUsage({
      userId: session?.user?.id,
      toolName: "security-headers",
      payload: {
        url: targetUrl,
        score,
      },
    });

    return NextResponse.json({
      url: targetUrl,
      status: response.status,
      score,
      checks,
      warnings,
      headers: responseHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not inspect headers for this URL",
      },
      { status: 500 },
    );
  }
}
