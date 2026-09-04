"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Layers3 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Spinner } from "@/components/layout/navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.push("/boards");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="grid min-h-[100dvh] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="flex items-center gap-3 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-[0.45rem] bg-white/15">
            <Layers3 className="size-4" />
          </span>{" "}
          Mini Kanban
        </div>
        <div className="max-w-lg">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-white/60">
            Make space for progress
          </p>
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.06em] xl:text-7xl">
            Organize the work that matters.
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-white/65">
            A calm, focused workspace for turning scattered ideas into visible
            momentum.
          </p>
        </div>
        <div className="flex items-center gap-5 text-sm text-white/65">
          <span className="inline-flex items-center gap-2">
            <Check className="size-4" /> Simple by design
          </span>
          <span className="inline-flex items-center gap-2">
            <Check className="size-4" /> Built for flow
          </span>
        </div>
      </section>
      <section className="flex items-center justify-center bg-background px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <div className="mb-8 flex items-center gap-3 font-semibold">
              <span className="flex size-9 items-center justify-center rounded-[0.45rem] bg-primary text-primary-foreground">
                <Layers3 className="size-4" />
              </span>{" "}
              Mini Kanban
            </div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Welcome back
            </p>
          </div>
          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-accent">
              Your workspace is ready
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em]">
              Sign in to continue.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Pick up exactly where you left off.
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-[0.45rem] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner /> Signing in...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            New here?{" "}
            <button
              onClick={() => router.push("/register")}
              className="font-medium text-foreground underline underline-offset-4 hover:text-accent"
            >
              Create an account
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
