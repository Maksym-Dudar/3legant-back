import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { GenerateOtpDto } from './dto/otp.dto';
import { MailService } from 'src/mail/mail.service';
import { OtpService } from 'src/otp/otp.service';
import { ResetPasswordOtpDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private mailService: MailService,
    private otpService: OtpService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const user = await this.userService.create({
      firstName: signUpDto.firstName,
      email: signUpDto.email,
      password: hashedPassword,
    });
    const { firstName, ...singInData } = user;
    return this.signIn(singInData);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByUserEmail(email);
    if (!user) {
      throw new BadRequestException('Email is incorrect');
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password is incorect');
    }
    const { password, ...result } = user;
    return result;
  }

  async signIn(signInDto: SignInDto) {
    return {
      access_token: this.jwtService.sign(signInDto),
    };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token not found');
    }
  }

  async generateOtp(generateOtpDto: GenerateOtpDto) {
    const otp = +this.otpService.generateOtp();
    await this.userService.updateOtp(generateOtpDto.email, otp);
    await this.mailService.sendMail(
      generateOtpDto.email,
      'Reset password',
      `Ваш код: ${otp}`,
    );
  }

  async resetPasswordOtp(resetPasswordOtpDto: ResetPasswordOtpDto) {
    const user = await this.userService.findByUserEmail(
      resetPasswordOtpDto.email,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.expareOtp || user.expareOtp < new Date(Date.now())) {
      throw new BadRequestException('Otp code is not changed');
    }
    if (user.otp != resetPasswordOtpDto.otp) {
      throw new UnauthorizedException('Otp code incorect');
    }
    const hashedPassword = await bcrypt.hash(resetPasswordOtpDto.password, 10);
    return this.userService.updateByEmail(resetPasswordOtpDto.email, {
      password: hashedPassword,
    });
  }
}
