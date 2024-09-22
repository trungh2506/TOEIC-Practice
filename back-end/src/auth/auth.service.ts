import {
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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(registerDto: RegisterDTO): Promise<{ access_token: string }> {
    const { username, email, password } = registerDto;

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

    const payload = { email: user.email, sub: user._id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async login(loginDto: LoginDTO): Promise<{ access_token: string }> {
    const { email, password } = loginDto;

    const user = await this.userService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { email: user.email, sub: user._id };

    return { access_token: this.jwtService.sign(payload) };
  }
}
