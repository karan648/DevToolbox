import { AuthForm } from "@/components/layout/auth-form";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-shell px-4 py-12 text-white">
      <div className="fixed right-4 top-4">
        <ThemeToggle />
      </div>
      <AuthForm mode="signup" />
    </div>
  );
}
