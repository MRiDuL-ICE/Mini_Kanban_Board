import { JwtPayload } from "@/modules/auth/interfaces/jwt-payload.interface";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * Extracts the authenticated user's JWT payload from the request object.
 *
 * @example
 * async getMe(@CurrentUser() user: JwtPayload) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtPayload;
  },
);
