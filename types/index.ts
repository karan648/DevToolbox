export type ToolName =
  | "dashboard"
  | "env-manager"
  | "api-tester"
  | "json-tools"
  | "error-debugger"
  | "docker-builder"
  | "settings";

export type RecentTool = {
  name: ToolName;
  path: string;
  visitedAt: number;
};

export type EnvVariable = {
  key: string;
  value: string;
  issues: string[];
};

export type AiDebugResponse = {
  explanation: string;
  rootCause: string;
  suggestedFix: string;
};
