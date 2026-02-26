import type { AiDebugResponse } from "@/types";

export interface AiProvider {
  analyzeError(input: { error: string; code?: string }): Promise<AiDebugResponse>;
}
