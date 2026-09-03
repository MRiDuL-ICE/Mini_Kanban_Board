import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message === "SESSION_EXPIRED") {
          return false;
        }

        return failureCount < 2;
      },
    },
  },
});
