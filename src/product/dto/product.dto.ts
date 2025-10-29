import { IsArray, IsBoolean, IsDate, IsEnum, IsInt, IsNumber, IsString } from 'class-validator';
import { Category } from 'generated/prisma';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsNumber()
  nStar: number;

  @IsNumber()
  sale: number;

  @IsDate()
  offer_expires: Date = new Date();

  @IsBoolean()
  isNew: boolean;

  @IsEnum(Category, { message: 'Category is incorect' })
  @IsArray({ each: true })
  category: Category[];

  @IsString()
  @IsArray({ each: true })
  image: string[];

  @IsString()
  @IsArray({ each: true })
  color: string[];

  @IsString()
  description: string;

  @IsString()
  measurements: string;

  @IsInt()
  reviews: number = 0;

  @IsBoolean()
  inStock: boolean = true;
  
}
