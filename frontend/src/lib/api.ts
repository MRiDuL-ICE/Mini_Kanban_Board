import type { ApiError, AuthTokens } from "@/types/api";
import { getAuthStore } from "@/store/auth-store";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

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
    const errBody: ApiError = {
      statusCode: res.status,
      message: text || res.statusText,
      error: "ApiError",
    };
    throw errBody;
  }

  return res.json() as Promise<T>;
}
