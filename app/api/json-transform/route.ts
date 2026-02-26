import { NextResponse } from "next/server";

import { getSafeServerSession } from "@/lib/auth-session";
import { jsonTransformSchema } from "@/lib/validations";
import {
  jsonToSql,
  jsonToTypescript,
  jsonToZod,
} from "@/server/tools/json-transformer";
import { logToolUsage } from "@/server/tools/usage";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = jsonTransformSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const output =
      parsed.data.target === "typescript"
        ? jsonToTypescript(parsed.data.json)
        : parsed.data.target === "zod"
          ? jsonToZod(parsed.data.json)
          : jsonToSql(parsed.data.json);

    const session = await getSafeServerSession();
    await logToolUsage({
      userId: session?.user?.id,
      toolName: "json-tools",
      payload: { target: parsed.data.target },
    });

    return NextResponse.json({ output });
  } catch {
    return NextResponse.json(
      { error: "Transformation failed. Ensure JSON is valid." },
      { status: 500 },
    );
  }
}
