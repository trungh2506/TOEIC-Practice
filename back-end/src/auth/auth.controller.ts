import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  Res,
} from '@nestjs/common';

import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './passport/local-auth.guard';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from 'src/decorator/public.decorator';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { Role } from 'src/enum/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDTO, @Res() res: Response) {
    // return this.authService.login(loginDto);

    const { access_token, refresh_token } =
      await this.authService.login(loginDto);

    // Lưu refresh token vào cookie
    res.cookie('refreshToken', refresh_token, {
      httpOnly: true, // Ngăn chặn truy cập qua JavaScript
      secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS
      sameSite: 'strict', // Ngăn chặn CSRF
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Thời gian hết hạn (30 ngày)
    });

    // Gửi token truy cập về phía client
    return res.json({ access_token });
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDTO) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @Public()
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies.refreshToken; // Lấy refresh token từ cookie
    if (!refreshToken) {
      return res.status(403).json({ message: 'Refresh Token is required' });
    }

    // Xử lý logic làm mới refresh token
    const { access_token } = await this.authService.refresh(refreshToken);

    return res.json({ access_token });
  }

  @Get('profile')
  getProfile(@Req() req) {
    return this.authService.profile(req.user?._id);
  }
}
