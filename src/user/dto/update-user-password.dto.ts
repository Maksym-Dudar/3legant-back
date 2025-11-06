import { IsNumber, IsString } from "class-validator";

export class UpdateUserDto {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}