import { NextResponse } from "next/server";

import { getSafeServerSession } from "@/lib/auth-session";
import { svgOptimizeSchema } from "@/lib/validations";
import { optimizeSvg } from "@/server/tools/svg-optimizer";
import { logToolUsage } from "@/server/tools/usage";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = svgOptimizeSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid SVG payload" },
        { status: 400 },
      );
    }

    const started = Date.now();
    const result = optimizeSvg(parsed.data.svg, parsed.data.options);
    const elapsedMs = Date.now() - started;

    const session = await getSafeServerSession();
    await logToolUsage({
      userId: session?.user?.id,
      toolName: "svg-optimizer",
      payload: {
        originalBytes: result.originalBytes,
        optimizedBytes: result.optimizedBytes,
        savingsPercent: result.savingsPercent,
      },
    });

    return NextResponse.json({
      ...result,
      elapsedMs,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not optimize this SVG. Please try another file.",
      },
      { status: 500 },
    );
  }
}
