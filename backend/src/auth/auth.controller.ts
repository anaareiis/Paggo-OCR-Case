// backend/src/auth/auth.controller.ts
import { Controller, Post, Get, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { CurrentUserId } from './auth.decorator';

class RegisterDto {
  email: string;
  password: string;
}
class LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const { email, password } = body;
    if (!email || !password) throw new BadRequestException('email and password are required');
    return this.auth.register(email, password);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    if (!email || !password) throw new BadRequestException('email and password are required');
    return this.auth.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUserId() userId: string) {
    return { userId };
  }
}
