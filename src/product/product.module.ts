import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductService } from './product.service';


@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
