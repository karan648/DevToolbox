const GITHUB_API = "https://api.github.com";

type PackageJson = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  engines?: Record<string, string>;
};

type RepoMeta = {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  default_branch: string;
  archived: boolean;
  html_url: string;
};

type RepoCoordinates = {
  owner: string;
  repo: string;
  ref?: string;
};

export type RepoAnalysisResult = {
  repo: {
    fullName: string;
    description: string;
    stars: number;
    primaryLanguage: string;
    defaultBranch: string;
    url: string;
  };
  howToRun: string[];
  dependencies: string[];
  envVariables: string[];
  possibleErrors: string[];
  techStack: string[];
  scannedFiles: string[];
};

const CANDIDATE_FILES = [
  "README.md",
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lockb",
  "requirements.txt",
  "pyproject.toml",
  "Pipfile",
  "go.mod",
  "Cargo.toml",
  "pom.xml",
  "build.gradle",
  "composer.json",
  "Dockerfile",
  "docker-compose.yml",
  "docker-compose.yaml",
  ".env.example",
  ".env.sample",
  ".env.template",
  ".env.local.example",
  "tsconfig.json",
  "next.config.js",
  "next.config.mjs",
  "vite.config.ts",
  "webpack.config.js",
];

function parseRepoUrl(input: string): RepoCoordinates | null {
  try {
    const url = new URL(input);
    if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
      return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      return null;
    }

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/i, "");
    let ref: string | undefined;

    if (parts[2] === "tree" && parts[3]) {
      ref = decodeURIComponent(parts[3]);
    }

    return { owner, repo, ref };
  } catch {
    return null;
  }
}

function getGithubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "DevToolbox-RepoAnalyzer",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

async function fetchRepoMeta(coords: RepoCoordinates): Promise<RepoMeta> {
  const response = await fetch(`${GITHUB_API}/repos/${coords.owner}/${coords.repo}`, {
    headers: getGithubHeaders(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `GitHub repository lookup failed (${response.status}). Ensure the repo is public or set GITHUB_TOKEN.`,
    );
  }

  return (await response.json()) as RepoMeta;
}

async function fetchRepoFile(
  coords: RepoCoordinates,
  path: string,
  ref: string,
): Promise<string | null> {
  const encodedPath = path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const response = await fetch(
    `${GITHUB_API}/repos/${coords.owner}/${coords.repo}/contents/${encodedPath}?ref=${encodeURIComponent(ref)}`,
    {
      headers: getGithubHeaders(),
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to read ${path} (${response.status})`);
  }

  const data = (await response.json()) as {
    type?: string;
    encoding?: string;
    content?: string;
  };

  if (data.type !== "file" || !data.content) {
    return null;
  }

  if (data.encoding === "base64") {
    return Buffer.from(data.content, "base64").toString("utf8");
  }

  return data.content;
}

function parseJsonSafe<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function detectPackageManager(files: Record<string, string>): "npm" | "pnpm" | "yarn" | "bun" {
  if (files["pnpm-lock.yaml"]) return "pnpm";
  if (files["yarn.lock"]) return "yarn";
  if (files["bun.lockb"]) return "bun";
  return "npm";
}

function scriptCommand(packageManager: "npm" | "pnpm" | "yarn" | "bun", script: string): string {
  if (packageManager === "npm") {
    return script === "install" ? "npm install" : `npm run ${script}`;
  }
  if (packageManager === "yarn") {
    return script === "install" ? "yarn" : `yarn ${script}`;
  }
  if (packageManager === "pnpm") {
    return script === "install" ? "pnpm install" : `pnpm ${script}`;
  }
  return script === "install" ? "bun install" : `bun run ${script}`;
}

function collectNodeDependencies(pkg: PackageJson): string[] {
  const deps = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
  };

  return Object.entries(deps)
    .map(([name, version]) => `${name}@${version}`)
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 45);
}

function collectPythonDependencies(files: Record<string, string>): string[] {
  const requirements = files["requirements.txt"];
  if (!requirements) return [];

  return requirements
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .slice(0, 45);
}

function collectGoDependencies(files: Record<string, string>): string[] {
  const goMod = files["go.mod"];
  if (!goMod) return [];

  return goMod
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("require "))
    .map((line) => line.replace(/^require\s+/, ""))
    .slice(0, 45);
}

function collectEnvVariables(files: Record<string, string>): string[] {
  const envSources = [
    files[".env.example"],
    files[".env.sample"],
    files[".env.template"],
    files[".env.local.example"],
  ].filter(Boolean) as string[];

  const envVars = new Set<string>();

  for (const source of envSources) {
    for (const line of source.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const match = trimmed.match(/^([A-Z][A-Z0-9_]*)\s*=/);
      if (match?.[1]) {
        envVars.add(match[1]);
      }
    }
  }

  const readme = files["README.md"];
  if (readme) {
    const matches = readme.match(/\b[A-Z][A-Z0-9]*_[A-Z0-9_]+\b/g) || [];
    for (const key of matches) {
      if (key.length <= 42) {
        envVars.add(key);
      }
    }
  }

  return Array.from(envVars).sort();
}

function detectTechStack(meta: RepoMeta, files: Record<string, string>, pkg: PackageJson | null): string[] {
  const stack = new Set<string>();

  if (meta.language) {
    stack.add(meta.language);
  }

  const dependencies = {
    ...(pkg?.dependencies || {}),
    ...(pkg?.devDependencies || {}),
  };

  if (files["package.json"]) stack.add("Node.js");
  if (files["tsconfig.json"] || dependencies.typescript) stack.add("TypeScript");
  if (dependencies.next) stack.add("Next.js");
  if (dependencies.react) stack.add("React");
  if (dependencies.vue) stack.add("Vue");
  if (dependencies.nuxt) stack.add("Nuxt");
  if (dependencies.svelte) stack.add("Svelte");
  if (dependencies.express) stack.add("Express");
  if (dependencies["@nestjs/core"]) stack.add("NestJS");

  if (files["requirements.txt"] || files["pyproject.toml"] || files["Pipfile"]) stack.add("Python");
  if (files["go.mod"]) stack.add("Go");
  if (files["Cargo.toml"]) stack.add("Rust");
  if (files["pom.xml"] || files["build.gradle"]) stack.add("Java/JVM");
  if (files["composer.json"]) stack.add("PHP");

  if (files["Dockerfile"] || files["docker-compose.yml"] || files["docker-compose.yaml"]) {
    stack.add("Docker");
  }

  return Array.from(stack);
}

function inferHowToRun(files: Record<string, string>, pkg: PackageJson | null): string[] {
  const steps: string[] = [];

  if (pkg) {
    const pm = detectPackageManager(files);
    steps.push(scriptCommand(pm, "install"));

    const scripts = pkg.scripts || {};
    if (scripts.dev) steps.push(scriptCommand(pm, "dev"));
    if (scripts.start) steps.push(scriptCommand(pm, "start"));
    if (scripts.build) steps.push(scriptCommand(pm, "build"));
    if (scripts.test) steps.push(scriptCommand(pm, "test"));
  }

  if (files["requirements.txt"]) {
    steps.push("python -m venv .venv && source .venv/bin/activate");
    steps.push("pip install -r requirements.txt");
  }

  if (files["go.mod"]) {
    steps.push("go run ./...");
  }

  if (files["Cargo.toml"]) {
    steps.push("cargo run");
  }

  if (files["docker-compose.yml"] || files["docker-compose.yaml"]) {
    steps.push("docker compose up --build");
  } else if (files["Dockerfile"]) {
    steps.push("docker build -t app . && docker run app");
  }

  return Array.from(new Set(steps)).slice(0, 12);
}

function inferPossibleErrors(
  files: Record<string, string>,
  pkg: PackageJson | null,
  envVariables: string[],
  meta: RepoMeta,
): string[] {
  const findings: string[] = [];

  if (!files["README.md"]) {
    findings.push("README.md is missing, onboarding may be unclear for new developers.");
  }

  if (files["package.json"] && !files["package-lock.json"] && !files["pnpm-lock.yaml"] && !files["yarn.lock"]) {
    findings.push("No Node lockfile found. Builds can be non-deterministic across environments.");
  }

  if (pkg?.scripts && !pkg.scripts.dev && !pkg.scripts.start) {
    findings.push("package.json lacks dev/start scripts, run instructions may be incomplete.");
  }

  const hasEnvTemplate = Boolean(
    files[".env.example"] || files[".env.sample"] || files[".env.template"] || files[".env.local.example"],
  );

  if (envVariables.length > 0 && !hasEnvTemplate) {
    findings.push("Environment variables are referenced but no .env template file was found.");
  }

  if (meta.archived) {
    findings.push("Repository is archived, dependency and security updates may be stale.");
  }

  return findings;
}

export async function analyzeGithubRepository(repoUrl: string): Promise<RepoAnalysisResult> {
  const coords = parseRepoUrl(repoUrl);

  if (!coords) {
    throw new Error("Invalid GitHub repository URL.");
  }

  const meta = await fetchRepoMeta(coords);
  const ref = coords.ref || meta.default_branch;

  const fileEntries = await Promise.all(
    CANDIDATE_FILES.map(async (path) => ({
      path,
      content: await fetchRepoFile(coords, path, ref),
    })),
  );

  const files: Record<string, string> = {};
  for (const entry of fileEntries) {
    if (entry.content) {
      files[entry.path] = entry.content;
    }
  }

  const pkg = files["package.json"] ? parseJsonSafe<PackageJson>(files["package.json"]) : null;

  const dependencies = [
    ...collectNodeDependencies(pkg || {}),
    ...collectPythonDependencies(files),
    ...collectGoDependencies(files),
  ].slice(0, 60);

  const envVariables = collectEnvVariables(files);
  const techStack = detectTechStack(meta, files, pkg);
  const howToRun = inferHowToRun(files, pkg);
  const possibleErrors = inferPossibleErrors(files, pkg, envVariables, meta);

  return {
    repo: {
      fullName: meta.full_name,
      description: meta.description || "No description provided.",
      stars: meta.stargazers_count,
      primaryLanguage: meta.language || "Unknown",
      defaultBranch: meta.default_branch,
      url: meta.html_url,
    },
    howToRun,
    dependencies,
    envVariables,
    possibleErrors,
    techStack,
    scannedFiles: Object.keys(files).sort((a, b) => a.localeCompare(b)),
  };
}
