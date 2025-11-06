import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, TUpdateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { Multer } from 'multer';
import * as fs from 'fs/promises';
import * as path from 'path';
import { AddressDto } from './dto/address.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  async updateById(id: number, updateUserDto: TUpdateUserDto) {
    delete updateUserDto.id;
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async updateByEmail(email: string, updateUserDto: TUpdateUserDto) {
    return this.prisma.user.update({
      where: { email },
      data: updateUserDto,
    });
  }

  async updateOtp(email: string, otp: number) {
    return this.prisma.user.update({
      where: { email },
      data: {
        otp: otp,
        expareOtp: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
  }

  async findByUserEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async updateAvatar(
    file: Multer.File,
    req: Express.Request & { user: { userId: number; email: string } },
  ) {
    if (!file || file.size === 0) {
      throw new BadRequestException('Файл не передано або він порожній');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Непідтримуваний формат файлу');
    }

    const uploadDir = path.join(process.cwd(), 'public', 'user', 'avatar');
    await fs.mkdir(uploadDir, { recursive: true });

    const extension = path.extname(file.originalname).toLowerCase();
    const safeExtension = extension.replace(/[^a-z0-9.]/gi, '');
    const fileName = `${req.user.email}${safeExtension}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    const res = await this.prisma.user.update({
      where: { email: req.user.email },
      data: { avatar: `/public/user/avatar/${fileName}` },
    });

    console.log(res);

    return { message: 'Аватар оновлено', path: `/user/avatar/${fileName}` };
  }

  async createAddress(address: AddressDto) {
    return this.prisma.addres.create({
      data: address,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        country: true,
        state: true,
        city: true,
        street: true,
        buildingNumber: true,
        zipCode: true,
      },
    });
  }

  async updateAddress(id: number, address: AddressDto) {
    return this.prisma.addres.update({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        country: true,
        state: true,
        city: true,
        street: true,
        buildingNumber: true,
        zipCode: true,
      },
      where: { id: id },
      data: address,
    });
  }

  async takeAllAddress(id: number) {
    return this.prisma.addres.findMany({ where: { userId: id } });
  }
}
