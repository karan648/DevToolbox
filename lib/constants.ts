import {
  Bot,
  Braces,
  Container,
  FileImage,
  FlaskConical,
  GitBranch,
  Home,
  KeySquare,
  KeyRound,
  Settings,
  Shield,
} from "lucide-react";

export const APP_NAME = "DevToolbox";
export const OPEN_SOURCE_GITHUB_URL = "https://github.com/karannn/devtoolbox";
export const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/karannn";

export const TOOL_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: Home, key: "dashboard" },
  {
    href: "/dashboard/env-manager",
    label: "Env Manager",
    icon: KeyRound,
    key: "env-manager",
  },
  {
    href: "/dashboard/api-tester",
    label: "API Tester",
    icon: FlaskConical,
    key: "api-tester",
  },
  {
    href: "/dashboard/json-tools",
    label: "JSON Tools",
    icon: Braces,
    key: "json-tools",
  },
  {
    href: "/dashboard/error-debugger",
    label: "Error Debugger",
    icon: Bot,
    key: "error-debugger",
  },
  {
    href: "/dashboard/docker-builder",
    label: "Docker Builder",
    icon: Container,
    key: "docker-builder",
  },
  {
    href: "/dashboard/repo-analyzer",
    label: "Repo Analyzer",
    icon: GitBranch,
    key: "repo-analyzer",
  },
  {
    href: "/dashboard/security-headers",
    label: "Security Headers",
    icon: Shield,
    key: "security-headers",
  },
  {
    href: "/dashboard/jwt-inspector",
    label: "JWT Inspector",
    icon: KeySquare,
    key: "jwt-inspector",
  },
  {
    href: "/dashboard/svg-optimizer",
    label: "SVG Optimizer",
    icon: FileImage,
    key: "svg-optimizer",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
    key: "settings",
  },
] as const;

export const PRICING_TIERS = [
  {
    name: "Free",
    price: "$0",
    subtitle: "Core tools for solo devs",
    cta: "Start Free",
    features: ["3 Core Tools", "Offline Access", "Community Support"],
    color: "bg-blue",
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    subtitle: "For builders shipping weekly",
    cta: "Upgrade to Pro",
    features: [
      "All Core Tools",
      "Repo Analyzer",
      "Security Audit Tools",
      "Usage Analytics",
      "Recent History",
    ],
    color: "bg-yellow",
    featured: true,
  },
  {
    name: "Team",
    price: "$49",
    subtitle: "For startups and squads",
    cta: "Contact Sales",
    features: ["Shared Workspaces", "Role Permissions", "Priority Support"],
    color: "bg-green",
    featured: false,
  },
] as const;

export const FEATURE_CARDS = [
  {
    title: "Env Manager",
    description: "Validate, lint, and export env files into clean templates.",
    color: "bg-yellow",
  },
  {
    title: "API Tester",
    description: "Run HTTP requests, inspect payloads, and generate snippets.",
    color: "bg-blue",
  },
  {
    title: "JSON Transformer",
    description: "Convert JSON to TypeScript, Zod schema, or SQL quickly.",
    color: "bg-green",
  },
  {
    title: "AI Debugger",
    description: "Get root cause analysis and concrete fixes for runtime errors.",
    color: "bg-coral",
  },
  {
    title: "Docker Builder",
    description: "Generate docker run and compose commands from visual forms.",
    color: "bg-orange",
  },
  {
    title: "Repo Analyzer",
    description: "Scan GitHub repos for setup instructions, env vars, and risks.",
    color: "bg-blue",
  },
  {
    title: "Security Headers Audit",
    description: "Check response headers and compliance gaps for production URLs.",
    color: "bg-green",
  },
  {
    title: "JWT Inspector",
    description: "Decode tokens, inspect claims, and validate expiration in seconds.",
    color: "bg-coral",
  },
  {
    title: "SVG Optimizer",
    description: "Minify SVG assets, remove metadata, and export React-ready markup fast.",
    color: "bg-orange",
  },
] as const;
