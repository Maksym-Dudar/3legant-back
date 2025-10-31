import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Category, Prisma } from 'generated/prisma';
import { CreateProductDto } from './dto/product.dto';
import { Sorts } from './type';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const product: Prisma.ProductCreateInput = {
      ...createProductDto,
    };
    return await this.prisma.product.create({ data: product });
  }

  async findManyBag(ids: string) {
    const idsArray = ids.split(',').map((id) => Number(id.trim()));

    const products = await this.prisma.product.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        color: true,
        image: true,
      },
      where: {
        id: {
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
        id: true,
        title: true,
        price: true,
        rating: true,
        sale: true,
        isNew: true,
        image: true,
      },
      where: {
        id: {
          in: idsArray,
        },
      },
    });

    return products.map((product) => ({
      ...product,
      image: product.image?.[0] ?? null,
    }));
  }

  async findOnePage(id: number) {
    const products = await this.prisma.product.findFirst({
      select: {
        id: true,
        product_group_id: true,
        title: true,
        description: true,
        price: true,
        offer_expires: true,
        measurements: true,
        rating: true,
        sale: true,
        isNew: true,
        image: true,
        category: true,
        reviews: true,
        color: true,
      },
      where: {
        id: id,
      },
    });

    const sameProduct = await this.prisma.product.findMany({
      select: {
        id: true,
        image: true,
        inStock: true,
        color: true,
      },
      where: {
        product_group_id: products?.product_group_id,
      },
    });

    const same = sameProduct.map((val) => {
      return { ...val, image: val.image[0] ?? null };
    });

    return { ...products, same: same };
  }

  async findManyNew(take: number) {
    const products = await this.prisma.product.findMany({
      take,
      select: {
        id: true,
        title: true,
        price: true,
        rating: true,
        sale: true,
        isNew: true,
        image: true,
      },
      where: {
        isNew: true,
      },
    });

    return products.map((product) => ({
      ...product,
      image: product.image?.[0] ?? null,
    }));
  }

  async findManyShop(
    skip: number,
    take: number,
    category: Category | 'All',
    sort: Sorts,
    topPrice?: number,
    lowPrice: number = 0,
  ) {
    let orderBy;
      switch (sort) {
        case Sorts.High_to_low_price:
          orderBy = {
            price: 'desc',
          };
          break;
        case Sorts.Low_to_high_price:
          orderBy = {
            price: 'asc',
          };
          break;
        case Sorts.Top_rated:
          orderBy = {
            nStar: 'desc',
          };
          break;
        default:
          orderBy = {
            rating: 'desc',
          };
          break;
      }

      if (category === 'All') {
        return await this.prisma.product.findMany({
          skip,
          take,
          where: {
            ...(sort === Sorts.Newest ? { isNew: true } : {}),
            price: {
              gte: lowPrice,
              ...(topPrice !== undefined ? { lte: topPrice } : {}),
            },
          },
          orderBy: [orderBy],
        });
      } else {
        return await this.prisma.product.findMany({
          skip,
          take,
          where: {
            ...(sort === Sorts.Newest ? { isNew: true } : {}),
            category: { hasSome: [category] },
            price: {
              gte: lowPrice,
              ...(topPrice !== undefined ? { lte: topPrice } : {}),
            },
          },
          orderBy: [orderBy],
        });
      }
  }
}
