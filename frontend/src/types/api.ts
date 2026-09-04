import { User } from "./domain";

export type LoginRequest = { email: string; password: string };
export type RegisterRequest = {
  email: string;
  password: string;
  name?: string;
};

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

export type AuthResponse = {
  tokens: AuthTokens;
  user: User;
};

export type ApiError = {
  statusCode: number;
  message: string | string[];
  error: string;
};
