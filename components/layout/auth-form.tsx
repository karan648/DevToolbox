"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Github, LogIn, UserPlus } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(2).max(80).optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const params = useSearchParams();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const callbackUrl = params.get("callbackUrl") || "/dashboard";

  const onSubmit = form.handleSubmit(async (values) => {
    if (mode === "signup") {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Signup failed");
        return;
      }

      toast.success("Account created. Signing you in...");
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Welcome to DevToolbox");
    router.push(result?.url || callbackUrl);
    router.refresh();
  });

  return (
    <Card className="w-full max-w-lg border-[4px] bg-slate-800 p-6">
      <h1 className="font-display text-4xl font-black text-white">
        {mode === "login" ? "Login" : "Signup"}
      </h1>
      <p className="mt-2 text-sm font-semibold text-slate-300">
        {mode === "login"
          ? "Use email/password, Google, or GitHub to enter your workspace."
          : "Create your account with email and password, or continue with OAuth."}
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        {mode === "signup" ? (
          <div>
            <label className="mb-1 block text-xs font-black uppercase text-slate-300">
              Name
            </label>
            <Input placeholder="Alex Rivera" {...form.register("name")} />
          </div>
        ) : null}

        <div>
          <label className="mb-1 block text-xs font-black uppercase text-slate-300">Email</label>
          <Input placeholder="dev@toolbox.com" {...form.register("email")} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-black uppercase text-slate-300">Password</label>
          <Input type="password" placeholder="••••••••" {...form.register("password")} />
        </div>

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {mode === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          {form.formState.isSubmitting
            ? mode === "login"
              ? "Signing in..."
              : "Creating account..."
            : mode === "login"
              ? "Enter Workspace"
              : "Create Account"}
        </Button>
      </form>

      <div className="mt-4 space-y-2">
        <Button
          className="w-full"
          variant="white"
          onClick={() => signIn("google", { callbackUrl })}
        >
          Continue with Google
        </Button>
        <Button
          className="w-full"
          variant="white"
          onClick={() => signIn("github", { callbackUrl })}
        >
          <Github className="h-4 w-4" /> Continue with GitHub
        </Button>
        <Link href={mode === "login" ? "/auth/signup" : "/auth/login"}>
          <Button variant="dark" className="w-full">
            {mode === "login" ? "Need an account? Sign up" : "Already a user? Login"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
