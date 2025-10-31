import { IsEmail, IsNumber, IsString } from 'class-validator';

export class ResetPasswordOtpDto {
  @IsString()
  password: string;

  @IsNumber()
  otp: number;

  @IsEmail()
  email: string;
}
