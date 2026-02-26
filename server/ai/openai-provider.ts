import type { AiProvider } from "@/server/ai/provider";
import type { AiDebugResponse } from "@/types";

const DEFAULT_BASE = "https://api.openai.com/v1";

export class OpenAICompatibleProvider implements AiProvider {
  async analyzeError(input: {
    error: string;
    code?: string;
  }): Promise<AiDebugResponse> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        explanation:
          "AI key is missing. Configure OPENAI_API_KEY in Settings or environment.",
        rootCause:
          "No AI provider key was found in the server environment.",
        suggestedFix:
          "Add OPENAI_API_KEY and optionally OPENAI_MODEL, then retry analysis.",
      };
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const base = process.env.OPENAI_API_BASE || DEFAULT_BASE;

    const prompt = [
      "You are a senior debugging assistant.",
      "Return JSON with keys: explanation, rootCause, suggestedFix.",
      "Keep each key concise and actionable.",
      `Error:\n${input.error}`,
      input.code ? `Code:\n${input.code}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const response = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        response_format: {
          type: "json_object",
        },
        messages: [
          { role: "system", content: "You debug software issues." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      return {
        explanation: "The AI provider returned an error.",
        rootCause: `HTTP ${response.status}: ${await response.text()}`,
        suggestedFix:
          "Check API credentials and model configuration in environment settings.",
      };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        explanation: "The AI provider returned an empty response.",
        rootCause: "No message content was present in the completion payload.",
        suggestedFix: "Retry with a shorter error trace or verify model availability.",
      };
    }

    try {
      const parsed = JSON.parse(content) as AiDebugResponse;
      return {
        explanation: parsed.explanation || "No explanation provided.",
        rootCause: parsed.rootCause || "No root cause provided.",
        suggestedFix: parsed.suggestedFix || "No fix suggestion provided.",
      };
    } catch {
      return {
        explanation: content,
        rootCause: "Provider response was not strict JSON.",
        suggestedFix:
          "Set a compatible model that supports JSON mode or adjust provider settings.",
      };
    }
  }
}
