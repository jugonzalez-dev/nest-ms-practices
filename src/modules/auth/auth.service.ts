import { Injectable, Inject } from '@nestjs/common';
import { AuthProviderPort, UserInfo, TokenResponse } from '@core/ports/services/auth-provider.port';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AuthProviderPort')
    private readonly authProvider: AuthProviderPort,
  ) {}

  async validateUser(token: string): Promise<UserInfo> {
    return this.authProvider.validateToken(token);
  }

  async getUserInfo(accessToken: string): Promise<UserInfo> {
    return this.authProvider.getUserInfo(accessToken);
  }

  getAuthorizationUrl(): string {
    return this.authProvider.getAuthorizationUrl();
  }

  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    return this.authProvider.exchangeCodeForToken(code);
  }
}

