"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const params = useSearchParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const callbackUrl = params.get("callbackUrl") || "/dashboard";

  const onSubmit = form.handleSubmit(async (values) => {
    const action = await signIn("email", {
      email: values.email,
      redirect: false,
      callbackUrl,
    });

    if (action?.error) {
      toast.error(action.error);
      return;
    }

    toast.success("Magic link sent. Check your inbox.");
  });

  return (
    <Card className="w-full max-w-lg border-[4px] bg-slate-800 p-6">
      <h1 className="font-display text-4xl font-black text-white">
        {mode === "login" ? "Login" : "Signup"}
      </h1>
      <p className="mt-2 text-sm font-semibold text-slate-300">
        {mode === "login"
          ? "Enter your workspace with email or Google."
          : "Create your free DevToolbox account."}
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-1 block text-xs font-black uppercase text-slate-300">Email</label>
          <Input placeholder="dev@toolbox.com" {...form.register("email")} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-black uppercase text-slate-300">Password</label>
          <Input type="password" placeholder="••••••••" {...form.register("password")} />
          <p className="mt-1 text-[11px] text-slate-400">
            Password is UI-only for this auth flow. Email login uses magic links.
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          <Mail className="h-4 w-4" />
          {form.formState.isSubmitting
            ? "Sending Link..."
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
