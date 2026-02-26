import { NextResponse } from "next/server";

import { getSafeServerSession } from "@/lib/auth-session";
import { envInputSchema } from "@/lib/validations";
import { parseEnv, envToJson } from "@/server/tools/env";
import { logToolUsage } from "@/server/tools/usage";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = envInputSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const result = parseEnv(parsed.data.raw);
    const session = await getSafeServerSession();
    await logToolUsage({
      userId: session?.user?.id,
      toolName: "env-manager",
      payload: { count: result.totals.count },
    });

    return NextResponse.json({
      ...result,
      json: envToJson(parsed.data.raw),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process env content" },
      { status: 500 },
    );
  }
}
