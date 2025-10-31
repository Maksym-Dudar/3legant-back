import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/product.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    const user = this.prisma.user.findFirst({
      select: {
        first_name: true,
        avatar: true,
      },
      where: {
        id: createCommentDto.user_id,
      },
    });
    return this.prisma.comment.create({
      data: {
        text: createCommentDto.text,
        rating: createCommentDto.rating,
        user: {
          connect: {
            id: createCommentDto.user_id,
          },
        },
        product: {
          connect: {
            id: createCommentDto.product_id,
          },
        },
      },
    });
  }

  async findManyProduct(product_id: number) {
    return this.prisma.comment.findMany({
      where: { product_id: product_id },
      select: {
        text: true,
        rating: true,
        user: {
          select: {
            first_name: true,
            avatar: true,
          },
        },
      },
    });
  }
}
