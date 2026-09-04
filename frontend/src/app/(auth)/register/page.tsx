"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Layers3 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Spinner } from "@/components/layout/navbar";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const router = useRouter();
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, password, name || undefined);
      router.push("/boards");
    } catch (err: any) {
      setError(err?.message || "Registration failed");
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
            Start with clarity
          </p>
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-[-0.06em] xl:text-7xl">
            Your best work deserves a home.
          </h1>
          <p className="mt-7 max-w-md text-base leading-7 text-white/65">
            Build a simple system that keeps priorities visible and progress
            moving.
          </p>
        </div>
        <div className="flex items-center gap-5 text-sm text-white/65">
          <span className="inline-flex items-center gap-2">
            <Check className="size-4" /> One clear view
          </span>
          <span className="inline-flex items-center gap-2">
            <Check className="size-4" /> Less noise
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
              Get started
            </p>
          </div>
          <div className="mb-8">
            <p className="mb-2 text-sm font-medium text-accent">
              A calmer way to work
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em]">
              Create your workspace.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Set up your account and make progress visible.
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
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Name <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                id="name"
                className="input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
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
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner /> Creating workspace...
                </>
              ) : (
                <>
                  Create account <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-medium text-foreground underline underline-offset-4 hover:text-accent"
            >
              Sign in
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
