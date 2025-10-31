import { IsEmail, IsString } from 'class-validator';

export class GenerateOtpDto { 
    @IsEmail()
    email: string;
}