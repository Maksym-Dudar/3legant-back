import {
  Controller,
  Post,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Get,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { UpdateUserDto } from './dto/update-user-password.dto';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';
import express from 'express';
import { AddressDto } from './dto/address.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async findUser(@Req() req: express.Request) {
    const { email, ...rest } = await this.authService.verifyToken(
      req.cookies.access_token,
    );
    const user = await this.userService.findByUserEmail(email);
    const { password, ...safeUser } = user ?? {};
    return safeUser;
  }

  @Post('update')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: express.Request,
  ) {
    const { email, ...rest } = await this.authService.verifyToken(
      req.cookies.access_token,
    );
    if (
      (updateUserDto.oldPassword && !updateUserDto.newPassword) ||
      (!updateUserDto.oldPassword && updateUserDto.newPassword)
    ) {
      throw new BadRequestException('Password not found');
    }

    if (updateUserDto.oldPassword && updateUserDto.newPassword) {
      await this.authService.validateUser(email, updateUserDto.oldPassword);
      const hashedPassword = await bcrypt.hash(updateUserDto.newPassword, 10);
      return await this.userService.updateByEmail(email, {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        password: hashedPassword,
      });
    } else {
      return await this.userService.updateById(email, {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
      });
    }
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @UploadedFile() file: Multer.Fil,
    @Req() req: express.Request,
  ) {
    const { email, ...rest } = await this.authService.verifyToken(
      req.cookies.access_token,
    );
    return await this.userService.updateAvatar(file, email);
  }

  @Post('address')
  async setAddress(@Body() address: AddressDto, @Req() req: express.Request) {
    const { email, ...rest } = await this.authService.verifyToken(
      req.cookies.access_token,
    );
    const user = await this.userService.findByUserEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return await this.userService.createAddress({
      ...address,
      email: email,
      userId: user?.id,
    });
  }

  @Put('address')
  async updateAddress(
    @Body() address: AddressDto & { id: number },
    @Req() req: express.Request,
  ) {
    const { email, ...rest } = await this.authService.verifyToken(
      req.cookies.access_token,
    );
    const user = await this.userService.findByUserEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const { id, ...addres } = address;
    return await this.userService.updateAddress(+id, {
      ...addres,
      email: user.email,
      userId: user.id,
    });
  }

  @Get('address')
  async getAddress(@Query('id') id: string) {
    return await this.userService.takeAllAddress(+id);
  }

  @Get('wishlist')
  async getWishlist(@Query('wishlist') wishlist: string) {
    const wishlistArrayString = wishlist.split(',');
    const wishlistArrayNumber = wishlistArrayString.map(Number).filter(Boolean);
    return await this.userService.takeAllWishlist(wishlistArrayNumber);
  }

  @Get('orders')
  async getOrders(@Req() req: express.Request) {
    const { email, ...rest } = await this.authService.verifyToken(
      req.cookies.access_token,
    );
    const user = await this.userService.findByUserEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return await this.userService.takeAllOrders(+user.id);
  }
}
