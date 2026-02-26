import { SettingsPanel } from "@/components/tools/settings-panel";

export default function SettingsPage() {
  return (
    <section>
      <h1 className="font-display text-5xl font-black">Settings</h1>
      <p className="mt-2 text-sm font-semibold text-slate-300">
        Manage profile details, light/dark mode, and AI provider configuration placeholders.
      </p>
      <div className="mt-5">
        <SettingsPanel />
      </div>
    </section>
  );
}
