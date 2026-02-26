"use client";

import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type ProfileResponse = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    plan: "FREE" | "PRO" | "TEAM";
    createdAt: string;
  };
};

export function SettingsPanel() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoadingProfile(true);
      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as ProfileResponse | { error?: string };

        if (!response.ok || !("user" in data)) {
          toast.error(("error" in data && data.error) || "Could not load profile");
          return;
        }

        setName(data.user.name || "");
        setEmail(data.user.email || "");
      } catch {
        toast.error("Could not load profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    void loadProfile();
  }, []);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = (await response.json()) as ProfileResponse | { error?: string };

      if (!response.ok || !("user" in data)) {
        toast.error(("error" in data && data.error) || "Could not save profile");
        return;
      }

      setName(data.user.name || "");
      setEmail(data.user.email || "");
      toast.success("Profile updated");
    } catch {
      toast.error("Could not save profile");
    } finally {
      setSavingProfile(false);
    }
  };

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
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={loadingProfile || savingProfile}
                placeholder={loadingProfile ? "Loading..." : "Your name"}
              />
            </div>
            <div>
              <p className="mb-1 text-xs font-black uppercase text-slate-300">Email</p>
              <Input
                value={email}
                readOnly
                disabled={loadingProfile}
                placeholder={loadingProfile ? "Loading..." : "No email"}
              />
            </div>
            <Button
              variant="green"
              onClick={saveProfile}
              disabled={loadingProfile || savingProfile}
            >
              {savingProfile ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Profile
            </Button>
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
