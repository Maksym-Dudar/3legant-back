import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/product.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  findManyProduct(@Query('product_id') product_id: string) {
    return this.commentService.findManyProduct(+product_id);
  }
}
