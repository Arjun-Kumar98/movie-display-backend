import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { setCorsHeaders } from '../middleware/cors.middleware';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res() res: Response) {
    try {
      const result = await this.authService.signup(dto);
      res.set(setCorsHeaders());
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      res.set(setCorsHeaders());
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message || 'Signup failed' });
    }
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(dto);
      res.set(setCorsHeaders());
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.set(setCorsHeaders());
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message || 'Login failed' });
    }
  }
}
