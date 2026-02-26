import { safeJsonParse } from "@/lib/utils";

type JsonValue = Record<string, unknown>;

function inferTsType(value: unknown): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    return `${inferTsType(value[0])}[]`;
  }

  switch (typeof value) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "object":
      if (value === null) return "null";
      return "object";
    default:
      return "unknown";
  }
}

export function jsonToTypescript(input: string) {
  const parsed = safeJsonParse<JsonValue>(input, {});
  const fields = Object.entries(parsed)
    .map(([key, value]) => `  ${key}: ${inferTsType(value)};`)
    .join("\n");

  return `interface DevToolboxData {\n${fields}\n}`;
}

export function jsonToZod(input: string) {
  const parsed = safeJsonParse<JsonValue>(input, {});
  const fields = Object.entries(parsed)
    .map(([key, value]) => {
      const base = inferTsType(value);
      if (base.endsWith("[]")) {
        return `  ${key}: z.array(z.${base.replace("[]", "")}()),`;
      }
      if (["string", "number", "boolean"].includes(base)) {
        return `  ${key}: z.${base}(),`;
      }
      return `  ${key}: z.any(),`;
    })
    .join("\n");

  return `import { z } from "zod";\n\nexport const schema = z.object({\n${fields}\n});`;
}

export function jsonToSql(input: string) {
  const parsed = safeJsonParse<JsonValue>(input, {});
  const fields = Object.entries(parsed)
    .map(([key, value]) => {
      const type = inferTsType(value);
      if (type === "number") return `  ${key} NUMERIC`;
      if (type === "boolean") return `  ${key} BOOLEAN`;
      return `  ${key} TEXT`;
    })
    .join(",\n");

  return `CREATE TABLE devtoolbox_data (\n  id SERIAL PRIMARY KEY,\n${fields}\n);`;
}
