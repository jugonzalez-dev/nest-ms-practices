import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SsoProviderAdapter } from '@infrastructure/auth/sso-provider.adapter';
import { JwtStrategy } from '@infrastructure/auth/jwt.strategy';
import { Auth0JwtGuard } from '@infrastructure/auth/auth0-jwt.guard';
import { JwtAuthGuard } from '@infrastructure/auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-jwt-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    Auth0JwtGuard,
    JwtAuthGuard,
    {
      provide: 'AuthProviderPort',
      useClass: SsoProviderAdapter,
    },
  ],
  exports: [AuthService, 'AuthProviderPort', JwtAuthGuard],
})
export class AuthModule {}

