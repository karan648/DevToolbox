import { OpenAICompatibleProvider } from "@/server/ai/openai-provider";
import type { AiProvider } from "@/server/ai/provider";

export function getAiProvider(): AiProvider {
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();

  switch (provider) {
    case "openai":
    default:
      return new OpenAICompatibleProvider();
  }
}
