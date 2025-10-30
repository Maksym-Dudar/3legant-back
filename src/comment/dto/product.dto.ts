import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string;

  @IsNumber()
  rating: number;

  @IsNumber()
  user_id: number;

  @IsNumber()
  product_id: number;
}
