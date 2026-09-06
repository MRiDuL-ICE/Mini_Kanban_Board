"use client";

import { useAuthStore } from "@/store/auth-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ReactNode, useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: (failureCount, error) => {
        if (error.message === "SESSION_EXPIRED") return false;
        return failureCount < 2;
      },
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          className:
            "!rounded-xl !border !border-border !bg-card !text-foreground !shadow-lg",
          success: { iconTheme: { primary: "#16a34a", secondary: "white" } },
          error: { iconTheme: { primary: "#dc2626", secondary: "white" } },
        }}
      />
    </QueryClientProvider>
  );
}
