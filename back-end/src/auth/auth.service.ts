import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';

import * as bcrypt from 'bcrypt';
import { RegisterDTO } from './dto/register.dto';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(registerDto: RegisterDTO) {
    const { username, email, password } = registerDto;
    console.log(registerDto);
    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new HttpException(
        'Email already in use',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const payload = { email: user.email, sub: user._id, roles: user.roles };

    return { user: user };
  }

  async login(loginDto: LoginDTO) {
    const { email, password } = loginDto;

    const user = await this.userService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new BadRequestException('Invalid email or password');
    }
    const payload = { email: user.email, sub: user._id, roles: user.roles };

    return {
      user: user,
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_SECRET_EXPIRE_IN',
        ),
      }),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const newAccessToken = this.jwtService.sign(
        { email: payload.email, sub: payload.sub, roles: payload.roles },
        { expiresIn: this.configService.get<string>('JWT_SECRET_EXPIRE_IN') },
      );
      return { access_token: newAccessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async profile(id: string) {
    const user = await this.userService.findOne(id);
    return user;
  }

  async signInWithGoogle(data: any) {
    if (!data) throw new BadRequestException();

    const user = await this.userService.findOneByEmail(data?.email);
    // NOT EXISTING
    if (!user) {
      // console.log('not existing');
      await this.register(data);
    }
    return await this.login(data);
  }
}
