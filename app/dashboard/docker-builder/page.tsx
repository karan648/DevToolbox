import { DockerBuilderTool } from "@/components/tools/docker-builder-tool";

export default function DockerBuilderPage() {
  return (
    <section>
      <h1 className="font-display text-5xl font-black">Docker Builder</h1>
      <p className="mt-2 text-sm font-semibold text-slate-300">
        Build container commands visually and export both `docker run` and `docker-compose`.
      </p>
      <div className="mt-5">
        <DockerBuilderTool />
      </div>
    </section>
  );
}
