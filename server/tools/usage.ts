import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function logToolUsage(input: {
  userId?: string;
  toolName: string;
  payload: Record<string, unknown>;
}) {
  if (!input.userId) {
    return;
  }

  try {
    await prisma.toolUsage.create({
      data: {
        userId: input.userId,
        toolName: input.toolName,
        payload: input.payload as Prisma.InputJsonValue,
      },
    });
  } catch {
    // Keep tool UX resilient even if logging fails.
  }
}
