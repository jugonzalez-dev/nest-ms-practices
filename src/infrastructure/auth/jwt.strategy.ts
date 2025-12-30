import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthProviderPort } from '@core/ports/services/auth-provider.port';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject('AuthProviderPort')
    private readonly authProvider: AuthProviderPort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-jwt-secret',
    });
  }

  async validate(payload: any) {
    try {
      // The payload is already decoded from the JWT
      // If the token comes directly from SSO, validate with the provider
      // If it's a local JWT, use the payload directly
      if (payload.token) {
        const userInfo = await this.authProvider.validateToken(payload.token);
        return userInfo;
      }

      // If the payload already contains user information, return it
      return {
        id: payload.sub || payload.id,
        email: payload.email,
        name: payload.name,
        roles: payload.roles || [],
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

