import type { z } from "zod";

import { dockerSchema } from "@/lib/validations";

type DockerInput = z.infer<typeof dockerSchema>;

export function buildDockerRun(input: DockerInput) {
  const lines = ["docker run"];

  if (input.name) {
    lines.push(`  --name ${input.name}`);
  }

  for (const port of input.ports) {
    if (port.host && port.container) {
      lines.push(`  -p ${port.host}:${port.container}`);
    }
  }

  for (const volume of input.volumes) {
    if (volume.host && volume.container) {
      lines.push(`  -v ${volume.host}:${volume.container}`);
    }
  }

  for (const item of input.env) {
    if (item.key) {
      lines.push(`  -e ${item.key}=${item.value}`);
    }
  }

  if (input.restart) {
    lines.push("  --restart unless-stopped");
  }

  if (input.detached) {
    lines.push("  -d");
  }

  lines.push(`  ${input.image}:${input.tag}`);

  return lines.join(" \\\n");
}

export function buildDockerCompose(input: DockerInput) {
  const ports = input.ports
    .filter((port) => port.host && port.container)
    .map((port) => `      - \"${port.host}:${port.container}\"`)
    .join("\n");

  const volumes = input.volumes
    .filter((volume) => volume.host && volume.container)
    .map((volume) => `      - ${volume.host}:${volume.container}`)
    .join("\n");

  const envVars = input.env
    .filter((item) => item.key)
    .map((item) => `      ${item.key}: \"${item.value}\"`)
    .join("\n");

  return `services:\n  app:\n    image: ${input.image}:${input.tag}\n${
    input.name ? `    container_name: ${input.name}\n` : ""
  }${input.detached ? "    tty: true\n" : ""}${
    input.restart ? "    restart: unless-stopped\n" : ""
  }${ports ? `    ports:\n${ports}\n` : ""}${
    volumes ? `    volumes:\n${volumes}\n` : ""
  }${envVars ? `    environment:\n${envVars}\n` : ""}`;
}
