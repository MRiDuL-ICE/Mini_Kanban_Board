"use client";

import { useRouter } from "next/navigation";
import { AuthPanel } from "@/components/auth/auth-panel";
import { AuthLogo } from "@/components/auth/auth-logo";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <main className="grid min-h-[100dvh] lg:grid-cols-[1.1fr_0.9fr]">
      <AuthPanel
        eyebrow="Start with clarity"
        heading="Your best work deserves a home."
        subheading="Build a simple system that keeps priorities visible and progress moving."
        features={["One clear view", "Less noise", "Built for teams"]}
      />

      <section className="flex items-center justify-center bg-background px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <AuthLogo />

          <div className="mb-8">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Get started
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em]">
              Create your workspace.
            </h2>
            <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
              Set up your account and make progress visible.
            </p>
          </div>

          <RegisterForm />

          <p className="mt-7 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-medium text-foreground underline underline-offset-4 hover:opacity-70"
            >
              Sign in
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
