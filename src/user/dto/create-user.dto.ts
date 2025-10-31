import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  last_name?: string;

  @IsNumber()
  otp?: number;

  @IsDate()
  expare_ot?: Date;

  @IsString()
  avatar?: string;
}

export type TUpdateUserDto = Partial<CreateUserDto>;
