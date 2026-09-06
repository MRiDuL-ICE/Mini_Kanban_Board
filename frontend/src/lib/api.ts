import type { ApiError, AuthTokens } from "@/types/api";
import { getAuthStore } from "@/store/auth-store";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string" && message) return message;
  }

  return fallback;
}

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const { accessToken, refreshAccessToken } = getAuthStore();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options?.headers || {}),
  } as Record<string, string>;

  const token = accessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && token) {
    try {
      await refreshAccessToken();
      const newToken = accessToken();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
        res = await fetch(`${API_BASE}${path}`, {
          ...options,
          headers,
        });
      }
    } catch {
      throw new Error("SESSION_EXPIRED");
    }
  }

  if (!res.ok) {
    const text = await res.text();
    let message = text || res.statusText;

    try {
      const errBody = JSON.parse(text) as ApiError;
      if (Array.isArray(errBody.message)) message = errBody.message.join(", ");
      else if (errBody.message) message = errBody.message;
    } catch {}

    throw new Error(message);
  }

  const text = await res.text();
  if (!text) return null as T;
  return JSON.parse(text) as T;
}
