import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthProviderPort } from '@core/ports/services/auth-provider.port';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

@Injectable()
export class Auth0JwtGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('AuthProviderPort')
    private readonly authProvider: AuthProviderPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Validate the token using Auth0 adapter
      // This decodes the token and extracts user info
      const userInfo = await this.authProvider.validateToken(token);

      // Attach user info to request
      request.user = userInfo;

      return true;
    } catch (error) {
      throw new UnauthorizedException(`Invalid token: ${error.message}`);
    }
  }
}

