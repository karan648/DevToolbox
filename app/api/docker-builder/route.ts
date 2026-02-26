import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { dockerSchema } from "@/lib/validations";
import { buildDockerCompose, buildDockerRun } from "@/server/tools/docker";
import { logToolUsage } from "@/server/tools/usage";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = dockerSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const runCommand = buildDockerRun(parsed.data);
    const compose = buildDockerCompose(parsed.data);

    const session = await getServerSession(authOptions);
    await logToolUsage({
      userId: session?.user?.id,
      toolName: "docker-builder",
      payload: { image: parsed.data.image },
    });

    return NextResponse.json({ runCommand, compose });
  } catch {
    return NextResponse.json(
      { error: "Could not generate Docker commands" },
      { status: 500 },
    );
  }
}
