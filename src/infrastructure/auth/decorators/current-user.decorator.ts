import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfo } from '@core/ports/services/auth-provider.port';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserInfo => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

