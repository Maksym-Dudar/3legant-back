import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
} from 'class-validator';
import { Category } from 'generated/prisma';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsNumber()
  price: number;

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
  color: string;
  
  @IsString()
  description: string;
  
  @IsString()
  measurements: string;
  
  @IsNumber()
  quantityWarehouse: number;
  
  @IsNumber()
  productGroupId: number;

  @IsString()
  @IsArray({ each: true })
  image: string[];
}

export class CreateProductGroupDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}