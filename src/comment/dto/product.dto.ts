import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string;

  @IsNumber()
  rating: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  productId: number;
}
