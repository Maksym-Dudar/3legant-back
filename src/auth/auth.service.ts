import { Injectable } from '@nestjs/common';
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
      first_name: signUpDto.first_name,
      email: signUpDto.email,
      password: hashedPassword,
    });
    return this.signIn({
      email: user.email,
      password: signUpDto.password,
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByUserEmail(email);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(signInDto: SignInDto) {
    return {
      access_token: this.jwtService.sign(signInDto),
    };
  }

  async generateOtp(generateOtpDto: GenerateOtpDto) {
    const otp = +this.otpService.generateOtp();
    await this.userService.updateOtp(generateOtpDto.email, otp);
    console.log(otp);
    await this.mailService.sendMail(
      generateOtpDto.email,
      'Reset password',
      `Ваш код: ${otp}`,
    );
  }

  async resetPasswordOtp(resetPasswordOtpDto: ResetPasswordOtpDto) {
    const user = await this.userService.findByUserEmail(resetPasswordOtpDto.email);
    if (
      !user ||
      user.otp != resetPasswordOtpDto.otp ||
      !user.expare_otp ||
      user.expare_otp < new Date(Date.now())
    ) {
      return null;
    }
    const hashedPassword = await bcrypt.hash(resetPasswordOtpDto.password, 10);

    return this.userService.updateByEmail(resetPasswordOtpDto.email, {
      password: hashedPassword,
    });
  }
}
