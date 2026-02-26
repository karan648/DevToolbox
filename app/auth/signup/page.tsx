import { AuthForm } from "@/components/layout/auth-form";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-shell px-4 py-12 text-white">
      <AuthForm mode="signup" />
    </div>
  );
}
