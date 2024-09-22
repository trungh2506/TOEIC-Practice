import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './passport/local-auth.guard';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from 'src/decorator/customize';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDTO) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
