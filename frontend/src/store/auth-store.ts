import { create } from "zustand";
import type { AuthResponse, AuthTokens } from "@/types/api";
import type { User } from "@/types/domain";
import { api } from "@/lib/api";

type AuthState = {
  hydrated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;

  hydrate: () => void;
  setTokens: (tokens: AuthTokens) => void;
  clearTokens: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  hydrated: false,
  accessToken: null,
  refreshToken: null,
  user: null,
  loading: false,

  hydrate: () => {
    if (typeof window === "undefined") return;
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    set({ accessToken, refreshToken, hydrated: true });
  },

  setTokens: (tokens) => {
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    set({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
  },

  clearTokens: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ accessToken: null, refreshToken: null, user: null });
  },

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  login: async (email, password) => {
    const response = await api<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    get().setTokens(response.tokens);
    get().setUser(response.user);
  },

  register: async (email, password, name) => {
    const response = await api<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
    get().setTokens(response.tokens);
    get().setUser(response.user);
  },

  logout: () => {
    const refreshToken = get().refreshToken;
    if (refreshToken) {
      api("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
      }).catch(() => {});
    }
    get().clearTokens();
  },

  refreshAccessToken: async () => {
    const refreshToken = get().refreshToken;
    if (!refreshToken) throw new Error("No refresh token");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      },
    );

    if (!res.ok) throw new Error("Refresh failed");

    const tokens: AuthTokens = await res.json();
    get().setTokens(tokens);
  },
}));

// safe to use outside components (interceptors etc.)
export function getAuthStore() {
  return {
    accessToken: () => useAuthStore.getState().accessToken,
    refreshToken: () => useAuthStore.getState().refreshToken,
    refreshAccessToken: () => useAuthStore.getState().refreshAccessToken(),
  };
}
