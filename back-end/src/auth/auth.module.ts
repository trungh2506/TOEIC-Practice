import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';

import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './passport/jwt.strategy';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshTokenStrategy } from './passport/refreshToken.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Lấy secret từ biến môi trường
        signOptions: {
          expiresIn: configService.get<string>('JWT_SECRET_EXPIRE_IN'),
        },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
