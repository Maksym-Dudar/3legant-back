import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Category, Prisma } from 'generated/prisma';
import { CreateProductDto, CreateProductGroupDto } from './dto/product.dto';
import { Sorts } from './type';
import { Multer } from 'multer';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, files: Multer.File[]) {
    if (!files || files.length == 0) {
      throw new BadRequestException('Файл не передано або він порожній');
    }
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException('Непідтримуваний формат файлу');
      }
    }
    try {
      createProductDto.price = Number(createProductDto.price);
      createProductDto.offerExpires = new Date(createProductDto.offerExpires);
      createProductDto.sale = Number(createProductDto.sale);
      createProductDto.quantityWarehouse = Number(
        createProductDto.quantityWarehouse,
      );
      createProductDto.productGroupId = Number(createProductDto.productGroupId);
      createProductDto.isNew = Boolean(createProductDto.isNew);
      createProductDto.category = String(createProductDto.category)
        .split(',')
        .map((val) => Category[val as keyof typeof Category]);
      let groupId = createProductDto.productGroupId;
      if (groupId == -1) {
        const productGroup: Prisma.ProductGroupCreateInput = {
          title: createProductDto.title,
        };
        const res = await this.prisma.productGroup.create({
          data: productGroup,
        });
        groupId = res.id;
      }
      const { title, productGroupId, ...rest } = createProductDto;
      const productData: Prisma.ProductCreateInput = {
        ...rest,
        image: [],
        rating: 5,
        reviews: 0,
        productGroup: {
          connect: { id: groupId },
        },
      };
      const product = await this.prisma.product.create({ data: productData });
      let imagePath: string[] = [];
      for (const file of files) {
        const uploadDir = path.join(
          process.cwd(),
          'public',
          'product',
          `${product.id}`,
        );
        await fs.mkdir(uploadDir, { recursive: true });
        const extension = path.extname(file.originalname).toLowerCase();
        const safeExtension = extension.replace(/[^a-z0-9.]/gi, '');
        const fileName = `${file.fieldname}${safeExtension}`;
        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, file.buffer);

        imagePath.push(`/public/product/${product.id}/${fileName}`);
      }
      const res = await this.prisma.product.update({
        where: { id: product.id },
        data: { image: imagePath },
      });
      return res;
    } catch (error) {
      console.error('Помилка при створенні продукту:', error);
      throw new InternalServerErrorException('Не вдалося створити продукт');
    }
  }

  async findManyBag(ids: string) {
    const idsArray = ids.split(',').map((id) => Number(id.trim()));

    const dataBase = await this.prisma.product.findMany({
      select: {
        id: true,
        price: true,
        color: true,
        image: true,
        productGroup: {
          select: {
            title: true,
          },
        },
      },
      where: {
        id: {
          in: idsArray,
        },
      },
    });
    return dataBase.map((val) => ({
      ...val,
      title: val.productGroup.title,
      image: `https://localhost:4200` + val.image[0],
    }));
  }

  async findManyGroup() {
    return await this.prisma.productGroup.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }

  async findManyCard(ids: string) {
    const idsArray = ids.split(',').map((id) => Number(id.trim()));
    const dataBase = await this.prisma.product.findMany({
      select: {
        id: true,
        price: true,
        rating: true,
        sale: true,
        isNew: true,
        image: true,
        productGroup: {
          select: {
            title: true,
          },
        },
      },
      where: {
        id: {
          in: idsArray,
        },
      },
    });

    return dataBase.map((val) => ({
      ...val,
      title: val.productGroup.title,
      image: `https://localhost:4200` + val.image[0],
    }));
  }

  async findOnePage(id: number) {
    const products = await this.prisma.product.findFirst({
      select: {
        id: true,
        productGroupId: true,
        price: true,
        offerExpires: true,
        measurements: true,
        rating: true,
        sale: true,
        isNew: true,
        image: true,
        category: true,
        reviews: true,
        color: true,
        description: true,
        productGroup: {
          select: {
            title: true,
          },
        },
      },
      where: {
        id: id,
      },
    });
    if (products) {
      products.image = (products.image ?? []).map(
        (val) => `https://localhost:4200${val}`,
      );
    }
    const sameProduct = await this.prisma.product.findMany({
      select: {
        id: true,
        image: true,
        quantityWarehouse: true,
        color: true,
      },
      where: {
        productGroupId: products?.productGroupId,
      },
    });

    const same = sameProduct.map((val) => {
      return {
        ...val,
        image: `https://localhost:4200` + val.image[0],
      };
    });

    return { ...products, title: products?.productGroup.title, same: same };
  }

  async findManyNew(take: number) {
    const dataBase = await this.prisma.product.findMany({
      take,
      select: {
        id: true,
        price: true,
        rating: true,
        sale: true,
        isNew: true,
        image: true,
        productGroup: {
          select: {
            title: true,
          },
        },
      },
      where: {
        isNew: true,
      },
    });

    return dataBase.map((val) => ({
      ...val,
      title: val.productGroup.title,
      image: `https://localhost:4200` + val.image[0],
    }));
  }

  async findManyShop(
    skip: number,
    take: number,
    category: Category | 'ALL',
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
          rating: 'desc',
        };
        break;
      default:
        orderBy = {
          rating: 'desc',
        };
        break;
    }
    const dataBase = await this.prisma.product.findMany({
      skip,
      take,
      where: {
        ...(sort === Sorts.Newest ? { isNew: true } : {}),
        ...(category !== 'ALL'
          ? { category: { hasSome: [Category[category as keyof typeof Category]] } }
          : {}),
        price: {
          gte: lowPrice,
          ...(Number.isFinite(topPrice) ? { lte: topPrice } : {}),
        },
      },
      select: {
        id: true,
        price: true,
        rating: true,
        sale: true,
        isNew: true,
        image: true,
        productGroup: {
          select: {
            title: true,
          },
        },
      },
      orderBy: [orderBy],
    });
    return dataBase.map((val) => ({
      ...val,
      title: val.productGroup.title,
      image: `https://localhost:4200` + val.image[0],
    }));
  }
}
