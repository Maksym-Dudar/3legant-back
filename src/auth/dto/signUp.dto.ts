import { IsEmail, IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  first_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
