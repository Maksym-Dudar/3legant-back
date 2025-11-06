import { IsEmail, IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  firstName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
