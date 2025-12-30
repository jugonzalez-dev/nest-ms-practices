import { Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from '@infrastructure/auth/decorators/public.decorator';
import { JwtAuthGuard } from '@infrastructure/auth/jwt-auth.guard';
import { CurrentUser } from '@infrastructure/auth/decorators/current-user.decorator';
import { UserInfo } from '@core/ports/services/auth-provider.port';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('login')
  login(@Res() res: Response) {
    const authUrl = this.authService.getAuthorizationUrl();
    return res.redirect(authUrl);
  }

  @Public()
  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    try {
      const tokenResponse = await this.authService.exchangeCodeForToken(code);
      // In production, you should set the token in an HTTP-only cookie or return it securely
      return res.json({
        accessToken: tokenResponse.accessToken,
        expiresIn: tokenResponse.expiresIn,
      });
    } catch (error) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: UserInfo) {
    return user;
  }

  @Public()
  @Post('validate')
  async validateToken(@Query('token') token: string) {
    try {
      const userInfo = await this.authService.validateUser(token);
      return { valid: true, user: userInfo };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

