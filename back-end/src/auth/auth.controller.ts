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
import { GoogleOAuthGuard } from 'src/auth/passport/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDTO, @Res() res: Response) {
    const result = await this.authService.login(loginDto);

    if (!result.success) {
      return res.status(403).json({
        success: false,
        message: result.message,
      });
    }
    const { user, access_token, refresh_token, message } = result;

    // Lưu refresh token vào cookie
    res.cookie('refreshToken', refresh_token, {
      httpOnly: false, // Ngăn chặn truy cập qua JavaScript
      secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS
      sameSite: 'strict', // Ngăn chặn CSRF
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Thời gian hết hạn (30 ngày)
    });

    // Gửi token truy cập về phía client
    return res.status(200).json({
      success: true,
      message: message,
      user,
      access_token,
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  @Public()
  async adminLogin(@Body() loginDto: LoginDTO, @Res() res: Response) {
    try {
      const result = await this.authService.adminLogin(loginDto);

      if (!result.success) {
        // Trả về nếu không phải admin
        return res.status(403).json({
          success: false,
          message: result.message,
        });
      }

      const { user, access_token, refresh_token } = result;

      // Lưu refresh token vào cookie
      res.cookie('refreshToken', refresh_token, {
        httpOnly: true, // Ngăn chặn truy cập qua JavaScript
        secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS trong môi trường production
        sameSite: 'strict', // Ngăn chặn CSRF
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Hết hạn sau 30 ngày
      });

      // Gửi token truy cập về phía client
      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công.',
        user,
        access_token,
      });
    } catch (error) {
      console.error('Admin login error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error. Please try again later.',
      });
    }
  }

  @Public()
  @Post('register')
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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.authService.profile(req.user?._id);
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req) {}

  @Public()
  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    // console.log('controller req.user with google', req.user);
    const { access_token, refresh_token } =
      await this.authService.signInWithGoogle(req.user);

    // Lưu access token vào cookie
    res.cookie('jwt', access_token, {
      httpOnly: false, // Ngăn chặn truy cập qua JavaScript
      secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS
      sameSite: 'strict', // Ngăn chặn CSRF
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Thời gian hết hạn (30 ngày)
    });

    // Lưu refresh token vào cookie
    res.cookie('refreshToken', refresh_token, {
      httpOnly: false, // Ngăn chặn truy cập qua JavaScript
      secure: process.env.NODE_ENV === 'production', // Chỉ gửi cookie qua HTTPS
      sameSite: 'strict', // Ngăn chặn CSRF
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Thời gian hết hạn (30 ngày)
    });
    res.redirect(process.env.NEXTJS_CLIENT);
  }
}
