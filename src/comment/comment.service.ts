import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/product.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    const user = this.prisma.user.findFirst({
      select: {
        firstName: true,
        avatar: true,
      },
      where: {
        id: createCommentDto.userId,
      },
    });
    return this.prisma.comment.create({
      data: {
        text: createCommentDto.text,
        rating: createCommentDto.rating,
        user: {
          connect: {
            id: createCommentDto.userId,
          },
        },
        product: {
          connect: {
            id: createCommentDto.productId,
          },
        },
      },
    });
  }

  async findManyProduct(productId: number) {
    return this.prisma.comment.findMany({
      where: { productId: productId },
      select: {
        text: true,
        rating: true,
        user: {
          select: {
            firstName: true,
            avatar: true,
          },
        },
      },
    });
  }
}
