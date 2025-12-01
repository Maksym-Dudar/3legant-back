import { Controller, Get, Post, Body, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CreateProductDto } from './dto/product.dto';
import { Sorts } from './type';
import { ProductService } from './product.service';
import { Category } from 'generated/prisma';
import { Multer } from 'multer';
import { AnyFilesInterceptor } from '@nestjs/platform-express';


@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  async createProduct(
    @UploadedFiles() files: Record<string, Multer.File[]>,
    @Body() body: CreateProductDto,
  ) {
    const uploadedFiles = Object.values(files).flat();
    return this.productService.create(body, uploadedFiles);
  }

  @Get('bag')
  findManyBag(@Query('ids') ids: string) {
    return this.productService.findManyBag(ids);
  }
  @Get('group')
  findManyGroup() {
    return this.productService.findManyGroup();
  }

  @Get('card')
  findManyCard(@Query('ids') ids: string) {
    return this.productService.findManyCard(ids);
  }

  @Get('page')
  findOnePage(@Query('id') id: string) {
    return this.productService.findOnePage(+id);
  }

  @Get('new')
  findManyNew(@Query('take') take: string) {
    return this.productService.findManyNew(+take);
  }

  @Get('shop')
  findManyShop(
    @Query('page') page: number,
    @Query('take') take: number,
    @Query('category') category: Category | "ALL",
    @Query('topPrice') topPrice: number,
    @Query('lowPrice') lowPrice: number,
    @Query('sort') sort: Sorts,
  ) {
    return this.productService.findManyShop(
      (+page - 1) * +take,
      +take,
      category as keyof typeof Category,
      sort,
      +topPrice,
      +lowPrice,
    );
  }
}
