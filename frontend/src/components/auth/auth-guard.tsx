"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { PageSkeleton } from "../layout/navbar";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted && hydrated && !accessToken) router.push("/login");
  }, [accessToken, hydrated, mounted, router]);

  if (!mounted || !hydrated)
    return (
      <main className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10">
        <PageSkeleton />
      </main>
    );
  if (!accessToken)
    return (
      <main className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10">
        <PageSkeleton />
      </main>
    );
  return <>{children}</>;
}
