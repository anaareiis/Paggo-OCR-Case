// backend/src/auth/auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class MockUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const userId = req.header('x-user-id') || req.headers['x-user-id'] as string | undefined;
    if (!userId) {
      throw new UnauthorizedException('Missing x-user-id header (mock auth)');
    }
    // attach to request for controllers/services to use
    (req as any).userId = userId;
    return true;
  }
}
