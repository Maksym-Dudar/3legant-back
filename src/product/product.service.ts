import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Category, Prisma, Product } from 'generated/prisma';
import { CreateProductDto } from './dto/product.dto';
import { Sorts } from './type';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    console.log(createProductDto);
    const product: Prisma.ProductCreateInput = {
      ...createProductDto,
    };
    return await this.prisma.product.create({ data: product });
  }

  async findManyBag(ids: string) {
    const idsArray = ids.split(',').map((id) => Number(id.trim()));

    const products = await this.prisma.product.findMany({
      select: {
        product_id: true,
        title: true,
        price: true,
        color: true,
        image: true,
      },
      where: {
        product_id: {
          in: idsArray,
        },
      },
    });

    return products.map((product) => ({
      ...product,
      image: product.image?.[0] ?? null,
    }));
  }

  async findManyCard(ids: string) {
    const idsArray = ids.split(',').map((id) => Number(id.trim()));
    const products = await this.prisma.product.findMany({
      select: {
        product_id: true,
        title: true,
        price: true,
        nStar: true,
        sale: true,
        isNew: true,
        color: true,
        image: true,
      },
      where: {
        product_id: {
          in: idsArray,
        },
      },
    });

    return products.map((product) => ({
      ...product,
      image: product.image?.[0] ?? null,
    }));
  }

  async findManyPage(ids: string) {
    const idsArray = ids.split(',').map((id) => Number(id.trim()));
    const products = await this.prisma.product.findMany({
      select: {
        product_id: true,
        title: true,
        description: true,
        price: true,
        offer_expires: true,
        measurements: true,
        nStar: true,
        sale: true,
        isNew: true,
        color: true,
        image: true,
        category: true,
        reviews: true,
      },
      where: {
        product_id: {
          in: idsArray,
        },
      },
    });

    
  }

  // async findAll(params: {
  //   skip: number;
  //   take: number;
  //   categorie: Category | 'All';
  //   topPrice?: number;
  //   lowerPrice?: number;
  //   sort: Sorts;
  // }) {
  //   const { skip, take, categorie, topPrice, lowerPrice = 0, sort } = params;

  //   let orderBy;
  //   switch (sort) {
  //     case Sorts.High_to_low_price:
  //       orderBy = {
  //         price: 'desc',
  //       };
  //       break;
  //     case Sorts.Low_to_high_price:
  //       orderBy = {
  //         price: 'asc',
  //       };
  //       break;
  //     case Sorts.Top_rated:
  //       orderBy = {
  //         nStar: 'desc',
  //       };
  //       break;
  //     default:
  //       orderBy = {
  //         nStar: 'desc',
  //       };
  //       break;
  //   }

  //   if (categorie === 'All') {
  //     return await this.prisma.product.findMany({
  //       skip,
  //       take,
  //       where: {
  //         ...(sort === Sorts.Newest ? { isNew: true } : {}),
  //         price: {
  //           gte: lowerPrice,
  //           ...(topPrice !== undefined ? { lte: topPrice } : {}),
  //         },
  //       },
  //       orderBy: [orderBy],
  //     });
  //   } else {
  //     return await this.prisma.product.findMany({
  //       skip,
  //       take,
  //       where: {
  //         ...(sort === Sorts.Newest ? { isNew: true } : {}),
  //         category: { hasSome: [categorie] },
  //         price: {
  //           gte: lowerPrice,
  //           ...(topPrice !== undefined ? { lte: topPrice } : {}),
  //         },
  //       },
  //       orderBy: [orderBy],
  //     });
  //   }
  // }

  // async findOne(id: number) {
  //   return await this.prisma.product.findUnique({
  //     where: { product_id: id },
  //   });
  // }

  // async update(params: { id: number; data: Prisma.ProductUpdateInput }) {
  //   const { id, data } = params;
  //   return await this.prisma.product.update({
  //     data,
  //     where: { product_id: id },
  //   });
  // }

  // async remove(id: number) {
  //   return await this.prisma.product.delete({ where: { product_id: id } });
  // }
}
