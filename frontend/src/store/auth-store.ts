import { create } from "zustand";
import type { AuthTokens } from "@/types/api";
import type { User } from "@/types/domain";
import { api } from "@/lib/api";

type AuthState = {
  accessToken: () => string | null;
  refreshToken: () => string | null;
  user: User | null;
  loading: boolean;

  setTokens: (tokens: AuthTokens) => void;
  clearTokens: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
};

function getStored(key: "access_token" | "refresh_token"): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

function setStored(key: "access_token" | "refresh_token", value: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}

function clearStored() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: () => getStored("access_token"),
  refreshToken: () => getStored("refresh_token"),
  user: null,
  loading: true,

  setTokens: (tokens) => {
    setStored("access_token", tokens.access_token);
    setStored("refresh_token", tokens.refresh_token);
  },

  clearTokens: () => {
    clearStored();
    set({ user: null });
  },

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  login: async (email, password) => {
    const tokens = await api<AuthTokens>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    get().setTokens(tokens);
    get().setUser({ id: "", email, name: "" });
  },

  register: async (email, password, name) => {
    const tokens = await api<AuthTokens>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
    get().setTokens(tokens);
    get().setUser({ id: "", email, name: name || "" });
  },

  logout: () => {
    const refresh_token = get().refreshToken();
    if (refresh_token) {
      api("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token }),
      }).catch(() => {});
    }
    get().clearTokens();
  },

  refreshAccessToken: async () => {
    const refresh_token = get().refreshToken();
    if (!refresh_token) throw new Error("No refresh token");

    const tokens = await api<AuthTokens>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token }),
    });
    get().setTokens(tokens);
  },
}));

export function getAuthStore() {
  const store = useAuthStore;
  return {
    accessToken: () => store.getState().accessToken(),
    refreshToken: () => store.getState().refreshToken(),
    refreshAccessToken: () => store.getState().refreshAccessToken(),
  };
}
