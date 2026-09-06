"use client";

import { useRouter } from "next/navigation";
import { AuthPanel } from "@/components/auth/auth-panel";
import { AuthLogo } from "@/components/auth/auth-logo";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const router = useRouter();

  return (
    <main className="grid min-h-[100dvh] lg:grid-cols-[1.1fr_0.9fr]">
      <AuthPanel
        eyebrow="Make space for progress"
        heading="Organize the work that matters."
        subheading="A calm, focused workspace for turning scattered ideas into visible momentum."
        features={["Simple by design", "Built for flow", "Always in sync"]}
      />

      <section className="flex items-center justify-center bg-background px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <AuthLogo />

          <div className="mb-8">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Welcome back
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">
              Sign in to continue.
            </h2>
            <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
              Pick up exactly where you left off.
            </p>
          </div>

          <LoginForm />

          <p className="mt-7 text-center text-sm text-muted-foreground">
            New here?{" "}
            <button
              onClick={() => router.push("/register")}
              className="font-medium text-foreground underline underline-offset-4 hover:opacity-70"
            >
              Create an account
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
