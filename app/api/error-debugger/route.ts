import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { errorDebuggerSchema } from "@/lib/validations";
import { getAiProvider } from "@/server/ai";
import { logToolUsage } from "@/server/tools/usage";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = errorDebuggerSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid payload" },
        { status: 400 },
      );
    }

    const provider = getAiProvider();
    const result = await provider.analyzeError({
      error: parsed.data.error,
      code: parsed.data.code,
    });

    const session = await getServerSession(authOptions);
    await logToolUsage({
      userId: session?.user?.id,
      toolName: "error-debugger",
      payload: { hasCode: Boolean(parsed.data.code) },
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
  }
}
