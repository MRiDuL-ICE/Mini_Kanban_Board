import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { user, loading, setLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (token && !user) {
      useAuthStore.getState().setUser({ id: "", email: "", name: "" });
    }
    setLoading(false);
  }, []);

  function requireAuth() {
    if (!loading && !user) {
      router.push("/login");
      return false;
    }
    return true;
  }

  return {
    user,
    loading,
    logout: useAuthStore((s) => s.logout),
    requireAuth,
  };
}
