import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
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
  findManyPage(@Query('ids') ids: string) {
    return this.productService.findManyPage(ids);
  }

  // @Get()
  // findAll(
  //   @Query('skip') skip: number,
  //   @Query('take') take: number,
  //   @Query('categorie') categorie: Category | "All",
  //   @Query('sort') sort: Sorts,
  //   @Query('top-price') topPrice?: number,
  //   @Query('lower-price') lowerPrice?: number,
  // ) {
  //   return this.productService.findAll({ skip, take, categorie, topPrice, lowerPrice, sort });
  // }

  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.productService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productService.update({ id, updateProductDto });
  // }

  // @Delete(':id')
  // remove(@Param('id') id: number) {
  //   return this.productService.remove(id);
  // }
}
