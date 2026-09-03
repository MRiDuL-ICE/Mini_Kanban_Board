import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

/**
 * Mark a route handler as public — bypasses the global JwtAuthGuard.
 * Use on auth endpoints (register, login) and the health check.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
