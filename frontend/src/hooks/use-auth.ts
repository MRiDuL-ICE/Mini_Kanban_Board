import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const hydrated = useAuthStore((s) => s.hydrated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();

  function requireAuth() {
    if (!hydrated) return true;
    if (!accessToken) {
      router.push("/login");
      return false;
    }
    return true;
  }

  return {
    user,
    loading,
    hydrated,
    accessToken,
    logout: useAuthStore((s) => s.logout),
    requireAuth,
  };
}
