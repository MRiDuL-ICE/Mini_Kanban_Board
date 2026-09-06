"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { getErrorMessage } from "@/lib/api";
import { Spinner } from "@/components/layout/navbar";
import toast from "react-hot-toast";
import { AuthInput } from "./auth-input";
import { AuthErrorAlert } from "./auth-error-alert";

export function RegisterForm() {
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
      toast.success("Account created successfully");
      router.push("/boards");
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Registration failed");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <AuthErrorAlert message={error} />}

      <AuthInput
        id="name"
        label="Name"
        value={name}
        onChange={setName}
        optional
        autoComplete="name"
      />
      <AuthInput
        id="email"
        label="Email address"
        type="email"
        value={email}
        onChange={setEmail}
        required
        autoComplete="email"
      />
      <AuthInput
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        required
        autoComplete="new-password"
      />

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? (
          <>
            <Spinner /> Creating workspace…
          </>
        ) : (
          <>
            Create account <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
