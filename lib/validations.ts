import { z } from "zod";

export const envInputSchema = z.object({
  raw: z.string().min(1, "Please paste your .env content"),
});

export const apiTesterSchema = z.object({
  url: z.string().url("Valid URL required"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  headers: z.record(z.string(), z.string()).default({}),
  body: z.string().optional(),
});

export const jsonTransformSchema = z.object({
  json: z.string().min(2),
  target: z.enum(["typescript", "zod", "sql"]),
});

export const errorDebuggerSchema = z.object({
  error: z.string().min(8),
  code: z.string().optional(),
});

export const dockerSchema = z.object({
  image: z.string().min(1),
  tag: z.string().default("latest"),
  name: z.string().optional(),
  ports: z.array(z.object({ host: z.string(), container: z.string() })).default([]),
  volumes: z.array(z.object({ host: z.string(), container: z.string() })).default([]),
  env: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
  restart: z.boolean().default(false),
  detached: z.boolean().default(true),
});

export const repoAnalyzerSchema = z.object({
  repoUrl: z
    .string()
    .url("A valid GitHub URL is required")
    .refine((value) => {
      try {
        const url = new URL(value);
        return url.hostname === "github.com" || url.hostname === "www.github.com";
      } catch {
        return false;
      }
    }, "Only GitHub repository URLs are supported"),
});

export const securityHeadersSchema = z.object({
  url: z.string().url("Valid URL required"),
});
