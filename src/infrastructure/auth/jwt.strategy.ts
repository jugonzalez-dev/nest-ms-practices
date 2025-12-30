import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthProviderPort } from '@core/ports/services/auth-provider.port';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @Inject('AuthProviderPort')
    private readonly authProvider: AuthProviderPort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // For Auth0 tokens (RS256), we can't verify with a simple secret
      // We'll decode without verification and validate in validate()
      secretOrKey: 'dummy-secret-for-decoding', // Not used for verification
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: any) {
    try {
      // Get the raw token from the Authorization header
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Token not found');
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Validate the token using Auth0 adapter
      // This decodes the token and extracts user info
      const userInfo = await this.authProvider.validateToken(token);

      return userInfo;
    } catch (error) {
      throw new UnauthorizedException(`Invalid token: ${error.message}`);
    }
  }
}

