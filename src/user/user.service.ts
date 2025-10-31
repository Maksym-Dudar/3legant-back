import { Injectable } from '@nestjs/common';
import { CreateUserDto, TUpdateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  updateById(id: number, updateUserDto: TUpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  updateByEmail(email: string, updateUserDto: TUpdateUserDto) {
    return this.prisma.user.update({
      where: { email },
      data: updateUserDto,
    });
  }

  updateOtp(email: string, otp: number) {
    return this.prisma.user.update({
      where: { email },
      data: {
        otp: otp,
        expare_otp: new Date(Date.now() + 5 * 60 * 1000),
      },
    });
  }

  findByUserEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }
}
