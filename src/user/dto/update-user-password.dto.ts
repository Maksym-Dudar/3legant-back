import { IsNumber, IsString } from "class-validator";

export class UpdateUserDto {
@IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}