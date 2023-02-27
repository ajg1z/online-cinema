import { RefreshToken } from './dto/refresh-token.dto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async register(@Body() payload: AuthDto) {
    return await this.authService.register(payload);
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async login(@Body() payload: AuthDto) {
    return await this.authService.login(payload);
  }

  @Post('login/access-token')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  async refresh(@Body() payload: RefreshToken) {
    return await this.authService.refreshToken(payload);
  }
}
