// backend/src/auth/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Returns:
 *  - req.user.userId (set by JwtStrategy) when present
 *  - otherwise req.headers['x-user-id'] (dev fallback)
 *
 * Use: @CurrentUserId() userId: string
 */
export const CurrentUserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  // 1) prefer authenticated user set by JwtStrategy
  const userIdFromJwt = req?.user?.userId ?? req?.user?.sub ?? undefined;
  if (userIdFromJwt) return userIdFromJwt;

  // 2) fallback to x-user-id header for local dev / backwards compatibility
  const header = req?.headers?.['x-user-id'] ?? req?.headers?.['x_user_id'] ?? undefined;
  if (Array.isArray(header)) return header[0];
  return header;
});
