"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const schema = z.object({
  image: z.string().min(1, "Image is required"),
  tag: z.string().min(1),
  name: z.string().optional(),
  ports: z.array(z.object({ host: z.string(), container: z.string() })),
  volumes: z.array(z.object({ host: z.string(), container: z.string() })),
  env: z.array(z.object({ key: z.string(), value: z.string() })),
  restart: z.boolean(),
  detached: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function DockerBuilderTool() {
  const [loading, setLoading] = useState(false);
  const [runCommand, setRunCommand] = useState("docker run --help");
  const [compose, setCompose] = useState("services:\n  app:\n    image: nginx:latest");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      image: "nginx",
      tag: "latest",
      name: "my-app",
      ports: [{ host: "8080", container: "80" }],
      volumes: [{ host: "./data", container: "/var/lib/data" }],
      env: [{ key: "NODE_ENV", value: "production" }],
      restart: true,
      detached: true,
    },
  });

  const ports = useFieldArray({ control: form.control, name: "ports" });
  const volumes = useFieldArray({ control: form.control, name: "volumes" });
  const env = useFieldArray({ control: form.control, name: "env" });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    try {
      const response = await fetch("/api/docker-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed");
      }

      setRunCommand(data.runCommand);
      setCompose(data.compose);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
      <Card className="space-y-4 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="mb-1 text-xs font-black uppercase text-slate-300">Image</p>
            <Input {...form.register("image")} placeholder="nginx" />
          </div>
          <div>
            <p className="mb-1 text-xs font-black uppercase text-slate-300">Tag</p>
            <Input {...form.register("tag")} placeholder="latest" />
          </div>
          <div className="md:col-span-3">
            <p className="mb-1 text-xs font-black uppercase text-slate-300">Container Name</p>
            <Input {...form.register("name")} placeholder="my-app" />
          </div>
        </div>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-black uppercase text-yellow">Port Mapping</p>
            <Button size="sm" variant="white" onClick={() => ports.append({ host: "", container: "" })}>
              <Plus className="h-4 w-4" /> Port
            </Button>
          </div>
          <div className="space-y-2">
            {ports.fields.map((field, index) => (
              <div className="grid grid-cols-2 gap-2" key={field.id}>
                <Input placeholder="Host" {...form.register(`ports.${index}.host`)} />
                <Input placeholder="Container" {...form.register(`ports.${index}.container`)} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-black uppercase text-yellow">Volumes</p>
            <Button
              size="sm"
              variant="white"
              onClick={() => volumes.append({ host: "", container: "" })}
            >
              <Plus className="h-4 w-4" /> Volume
            </Button>
          </div>
          <div className="space-y-2">
            {volumes.fields.map((field, index) => (
              <div className="grid grid-cols-2 gap-2" key={field.id}>
                <Input placeholder="Host path" {...form.register(`volumes.${index}.host`)} />
                <Input placeholder="Container path" {...form.register(`volumes.${index}.container`)} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-black uppercase text-yellow">Environment</p>
            <Button size="sm" variant="white" onClick={() => env.append({ key: "", value: "" })}>
              <Plus className="h-4 w-4" /> Env
            </Button>
          </div>
          <div className="space-y-2">
            {env.fields.map((field, index) => (
              <div className="grid grid-cols-2 gap-2" key={field.id}>
                <Input placeholder="Key" {...form.register(`env.${index}.key`)} />
                <Input placeholder="Value" {...form.register(`env.${index}.value`)} />
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <input type="checkbox" className="h-4 w-4" {...form.register("restart")} />
            Restart Always
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <input type="checkbox" className="h-4 w-4" {...form.register("detached")} />
            Detached Mode
          </label>
        </div>

        <Button onClick={onSubmit} disabled={loading}>
          {loading ? <LoadingSpinner /> : "Generate Commands"}
        </Button>
      </Card>

      <Card className="space-y-4 p-4">
        <div className="rounded-xl border-[3px] border-black bg-slate-900 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-black uppercase text-slate-300">docker run</p>
            <CopyButton text={runCommand} />
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-yellow">{runCommand}</pre>
        </div>

        <div className="rounded-xl border-[3px] border-black bg-slate-900 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-black uppercase text-slate-300">docker-compose</p>
            <CopyButton text={compose} />
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-blue">{compose}</pre>
        </div>
      </Card>
    </div>
  );
}
