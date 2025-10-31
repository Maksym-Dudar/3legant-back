import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import express from 'express';
import { GenerateOtpDto } from './dto/otp.dto';
import { ResetPasswordOtpDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const token = await this.authService.signUp(dto);
    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3000 * 60 * 60,
    });
    return { masage: 'sign-in' };
  }

  @Post('sign-in')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.authService.signIn(user);
    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3000 * 60 * 60,
    });
    return { masage: 'sign-in' };
  }

  @Post('otpcode')
  async generateOtp(@Body() dto: GenerateOtpDto) {
    return this.authService.generateOtp(dto);
  }

  @Post('reset-password-otp')
  async resetPasswordOtp(@Body() dto: ResetPasswordOtpDto) {
    return this.authService.resetPasswordOtp(dto);
  }
}
