import type { EnvVariable } from "@/types";

const KEY_REGEX = /^[A-Z_][A-Z0-9_]*$/;

export function parseEnv(raw: string) {
  const lines = raw.split(/\r?\n/);
  const variables: EnvVariable[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      variables.push({ key: trimmed, value: "", issues: ["Missing '=' separator"] });
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    const issues: string[] = [];

    if (!KEY_REGEX.test(key)) {
      issues.push("Invalid variable key format");
    }

    if (!value) {
      issues.push("Empty value");
    }

    if (/(password|secret|token|key)/i.test(key) && value.length < 8) {
      issues.push("Sensitive key appears too short");
    }

    variables.push({ key, value, issues });
  }

  const example = variables
    .map((variable) => `${variable.key}=`)
    .join("\n");

  return {
    variables,
    totals: {
      count: variables.length,
      errors: variables.reduce((acc, variable) => acc + variable.issues.length, 0),
    },
    example,
  };
}

export function envToJson(raw: string) {
  const parsed = parseEnv(raw);
  const object: Record<string, string> = {};

  for (const variable of parsed.variables) {
    object[variable.key] = variable.value;
  }

  return JSON.stringify(object, null, 2);
}
