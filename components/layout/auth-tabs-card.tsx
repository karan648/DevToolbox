"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Github, LogIn, UserPlus } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;
type AuthTab = "login" | "signup";

function getTabFromQuery(value: string | null): AuthTab {
  return value === "signup" ? "signup" : "login";
}

function sanitizeCallbackUrl(value: string | null) {
  if (!value) return "/dashboard";
  if (value.startsWith("/")) return value;

  try {
    const url = new URL(value);
    const safePath = `${url.pathname}${url.search}${url.hash}`;
    return safePath.startsWith("/") ? safePath : "/dashboard";
  } catch {
    return "/dashboard";
  }
}

export function AuthTabsCard() {
  const params = useSearchParams();

  const tabFromQuery = useMemo(() => getTabFromQuery(params.get("tab")), [params]);
  const [tab, setTab] = useState<AuthTab>(tabFromQuery);

  useEffect(() => {
    setTab(tabFromQuery);
  }, [tabFromQuery]);

  const callbackUrl = sanitizeCallbackUrl(params.get("callbackUrl"));

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const loginWithCredentials = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (!result || result.error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Welcome to DevToolbox");
    window.location.assign(callbackUrl);
  };

  const handleLogin = loginForm.handleSubmit(async (values) => {
    await loginWithCredentials(values.email, values.password);
  });

  const handleSignup = signupForm.handleSubmit(async (values) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      toast.error(data.error || "Could not create account");
      return;
    }

    toast.success("Account created. Signing in...");
    await loginWithCredentials(values.email, values.password);
  });

  return (
    <Card className="w-full max-w-xl border-[4px] bg-slate-800 p-6">
      <div className="grid grid-cols-2 gap-2 rounded-xl border-[3px] border-black bg-slate-900 p-1">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={`rounded-lg border-[3px] border-black px-3 py-2 text-sm font-black uppercase transition ${
            tab === "login" ? "bg-yellow text-black" : "bg-slate-800 text-slate-200"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setTab("signup")}
          className={`rounded-lg border-[3px] border-black px-3 py-2 text-sm font-black uppercase transition ${
            tab === "signup" ? "bg-yellow text-black" : "bg-slate-800 text-slate-200"
          }`}
        >
          Register
        </button>
      </div>

      {tab === "login" ? (
        <form className="mt-5 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="mb-1 block text-xs font-black uppercase text-slate-300">Email</label>
            <Input placeholder="dev@toolbox.com" {...loginForm.register("email")} />
            {loginForm.formState.errors.email ? (
              <p className="mt-1 text-xs font-semibold text-coral">
                {loginForm.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-xs font-black uppercase text-slate-300">Password</label>
            <Input type="password" placeholder="••••••••" {...loginForm.register("password")} />
            {loginForm.formState.errors.password ? (
              <p className="mt-1 text-xs font-semibold text-coral">
                {loginForm.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
            <LogIn className="h-4 w-4" />
            {loginForm.formState.isSubmitting ? "Signing in..." : "Enter Workspace"}
          </Button>
        </form>
      ) : (
        <form className="mt-5 space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="mb-1 block text-xs font-black uppercase text-slate-300">
              Display Name
            </label>
            <Input placeholder="Alex Rivera" {...signupForm.register("name")} />
            {signupForm.formState.errors.name ? (
              <p className="mt-1 text-xs font-semibold text-coral">
                {signupForm.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-xs font-black uppercase text-slate-300">Email</label>
            <Input placeholder="dev@toolbox.com" {...signupForm.register("email")} />
            {signupForm.formState.errors.email ? (
              <p className="mt-1 text-xs font-semibold text-coral">
                {signupForm.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-xs font-black uppercase text-slate-300">Password</label>
            <Input type="password" placeholder="Minimum 8 characters" {...signupForm.register("password")} />
            {signupForm.formState.errors.password ? (
              <p className="mt-1 text-xs font-semibold text-coral">
                {signupForm.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={signupForm.formState.isSubmitting}>
            <UserPlus className="h-4 w-4" />
            {signupForm.formState.isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      )}

      <div className="mt-5 space-y-2">
        <Button
          type="button"
          className="w-full"
          variant="white"
          onClick={() => signIn("google", { callbackUrl })}
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          className="w-full"
          variant="white"
          onClick={() => signIn("github", { callbackUrl })}
        >
          <Github className="h-4 w-4" /> Continue with GitHub
        </Button>
      </div>
    </Card>
  );
}
