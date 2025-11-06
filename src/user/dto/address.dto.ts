import {
  IsNumber,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
} from 'class-validator';

export class AddressDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  email: string;

  @IsString()
  country: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsString()
  street: string;

  @IsString()
  buildingNumber: string;

  @IsPostalCode()
  zipCode: string;

  @IsNumber()
  userId: number;
}
