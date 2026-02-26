import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { repoAnalyzerSchema } from "@/lib/validations";
import { analyzeGithubRepository } from "@/server/tools/repo-analyzer";
import { logToolUsage } from "@/server/tools/usage";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = repoAnalyzerSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid repository URL" },
        { status: 400 },
      );
    }

    const result = await analyzeGithubRepository(parsed.data.repoUrl);

    const session = await getServerSession(authOptions);
    await logToolUsage({
      userId: session?.user?.id,
      toolName: "repo-analyzer",
      payload: {
        repo: result.repo.fullName,
        stackCount: result.techStack.length,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Repository analysis failed. Try another public repository.",
      },
      { status: 500 },
    );
  }
}
