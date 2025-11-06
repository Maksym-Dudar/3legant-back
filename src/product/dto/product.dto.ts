import { IsArray, IsBoolean, IsDate, IsEnum, IsInt, IsNumber, IsString } from 'class-validator';
import { Category } from 'generated/prisma';

export class CreateProductDto {
  @IsNumber()
  productGroupId: number;

  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsNumber()
  rating: number;

  @IsNumber()
  sale: number;

  @IsDate()
  offerExpires: Date = new Date();

  @IsBoolean()
  isNew: boolean;

  @IsEnum(Category, { message: 'Category is incorect' })
  @IsArray({ each: true })
  category: Category[];

  @IsString()
  @IsArray({ each: true })
  image: string[];

  @IsString()
  color: string;

  @IsString()
  description: string;

  @IsString()
  measurements: string;

  @IsInt()
  reviews: number = 0;

  @IsBoolean()
  inStock: boolean = true;
}
