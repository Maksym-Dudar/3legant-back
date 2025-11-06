import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  id?: number;

  @IsString()
  firstName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  lastName?: string;

  @IsNumber()
  otp?: number;

  @IsDate()
  expareOt?: Date;

  @IsString()
  avatar?: string;
}

export type TUpdateUserDto = Partial<CreateUserDto>;
