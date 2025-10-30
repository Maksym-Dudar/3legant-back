import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/product.dto';
import { Category } from 'generated/prisma';
import { Sorts } from './type';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get('bag')
  findManyBag(@Query('ids') ids: string) {
    return this.productService.findManyBag(ids);
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
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('category') category: Category | 'All',
    @Query('topPrice') topPrice: number,
    @Query('lowPrice') lowPrice: number,
    @Query('sort') sort: Sorts,
  ) {
    return this.productService.findManyShop(
      +skip,
      +take,
      category,
      sort,
      topPrice,
      lowPrice,
    );
  }
}
