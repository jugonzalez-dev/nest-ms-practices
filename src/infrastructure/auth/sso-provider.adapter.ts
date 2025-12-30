import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthProviderPort, UserInfo, TokenResponse } from '@core/ports/services/auth-provider.port';
import * as jwt from 'jsonwebtoken';

/**
 * Concrete adapter for SSO provider
 * Implements AuthProviderPort using OAuth2/OpenID Connect
 */
@Injectable()
export class SsoProviderAdapter implements AuthProviderPort {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly authorizationUrl: string;
  private readonly tokenUrl: string;
  private readonly userInfoUrl: string;
  private readonly redirectUri: string;
  private readonly jwtSecret: string;
  private readonly domain: string;
  private readonly audience: string;

  constructor(private readonly configService: ConfigService) {
    this.clientId = this.configService.get<string>('SSO_CLIENT_ID') || 'default-client-id';
    this.clientSecret = this.configService.get<string>('SSO_CLIENT_SECRET') || 'default-secret';
    this.domain = this.configService.get<string>('SSO_DOMAIN') || '';
    this.audience = this.configService.get<string>('SSO_AUDIENCE') || '';
    this.authorizationUrl = this.configService.get<string>('SSO_AUTHORIZATION_URL') || `https://${this.domain}/authorize`;
    this.tokenUrl = this.configService.get<string>('SSO_TOKEN_URL') || `https://${this.domain}/oauth/token`;
    this.userInfoUrl = this.configService.get<string>('SSO_USERINFO_URL') || `https://${this.domain}/userinfo`;
    this.redirectUri = this.configService.get<string>('SSO_REDIRECT_URI') || 'http://localhost:3000/auth/callback';
    this.jwtSecret = this.configService.get<string>('JWT_SECRET') || 'default-jwt-secret';
  }

  async validateToken(token: string): Promise<UserInfo> {
    try {
      // For Auth0, we can decode without verification for basic info
      // In production, you should verify the token signature using JWKS
      const decoded = jwt.decode(token, { complete: true }) as any;

      if (!decoded || !decoded.payload) {
        throw new Error('Invalid token format');
      }

      const payload = decoded.payload;

      return {
        id: payload.sub || payload.id,
        email: payload.email,
        name: payload.name || payload.nickname || '',
        roles: payload['https://your-namespace/roles'] || payload.roles || [],
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async getUserInfo(accessToken: string): Promise<UserInfo> {
    try {
      // Make HTTP call to Auth0 userinfo endpoint
      const response = await fetch(this.userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.statusText}`);
      }

      const userData = await response.json();

      return {
        id: userData.sub || userData.user_id,
        email: userData.email,
        name: userData.name || userData.nickname || '',
        roles: userData['https://your-namespace/roles'] || userData.roles || [],
      };
    } catch (error) {
      throw new Error(`Failed to get user info from SSO: ${error.message}`);
    }
  }

  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      state: this.generateState(),
      ...(this.audience && { audience: this.audience }),
    });

    return `${this.authorizationUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    try {
      // Make HTTP call to Auth0 token endpoint
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.redirectUri,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Token exchange failed: ${response.statusText} - ${errorData}`);
      }

      const tokenData = await response.json();

      return {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in || 3600,
        tokenType: tokenData.token_type || 'Bearer',
      };
    } catch (error) {
      throw new Error(`Failed to exchange code for token: ${error.message}`);
    }
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

