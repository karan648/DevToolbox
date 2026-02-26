"use client";

import { Save } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function SettingsPanel() {
  const [name, setName] = useState("Alex Rivera");
  const [apiKey, setApiKey] = useState("");

  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-black text-white">Profile</h3>
            <Badge variant="yellow">Personal</Badge>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <p className="mb-1 text-xs font-black uppercase text-slate-300">Display Name</p>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div>
              <p className="mb-1 text-xs font-black uppercase text-slate-300">Email</p>
              <Input value="alex@devtoolbox.dev" readOnly />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-black text-white">Appearance</h3>
            <Badge variant="blue">Theme</Badge>
          </div>
          <p className="mt-4 text-sm text-slate-300">Choose between dark and light neobrutal modes.</p>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-black text-white">AI Provider Config</h3>
          <Badge variant="green">Placeholder</Badge>
        </div>
        <p className="mt-2 text-sm text-slate-300">
          Store provider key in environment variables for production. This field is a UI
          placeholder.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_180px]">
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
          />
          <Button variant="green">
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>
      </Card>
    </div>
  );
}
