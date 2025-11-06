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
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { UpdateUserDto } from './dto/update-user-password.dto';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { AddressDto } from './dto/address.dto';

// @UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findUser(@Query('email') email: string) {
    const user = await this.userService.findByUserEmail(email);
    return {
      ...user,
      password: null,
    };
  }

  @Post('update')
  async update(@Body() updateUserDto: UpdateUserDto) {
    if (!updateUserDto.id) {
      throw new BadRequestException('User not found');
    }
    console.log(updateUserDto);
    if (
      (updateUserDto.oldPassword && !updateUserDto.newPassword) ||
      (!updateUserDto.oldPassword && updateUserDto.newPassword)
    ) {
      throw new BadRequestException('Password not found');
    }

    if (updateUserDto.oldPassword && updateUserDto.newPassword) {
      await this.authService.validateUser(
        updateUserDto.email,
        updateUserDto.oldPassword,
      );
      const hashedPassword = await bcrypt.hash(updateUserDto.newPassword, 10);
      return await this.userService.updateById(+updateUserDto.id, {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        password: hashedPassword,
      });
    } else {
      return await this.userService.updateById(+updateUserDto.id, {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
      });
    }
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @UploadedFile() file: Multer.Fil,
    @Req() req: Express.Request & { user: { userId: number; email: string } },
  ) {
    return await this.userService.updateAvatar(file, req);
  }

  @Post('address')
  async setAddress(@Body() address: AddressDto) {
    return await this.userService.createAddress(address);
  }

  @Put('address')
  async updateAddress(@Body() address: AddressDto & {id: number}) {
    const { id, ...addres } = address;
    return await this.userService.updateAddress(+id, addres);
  }

  @Get('address')
  async getAddress(@Query('id') id: string) {
    return await this.userService.takeAllAddress(+id);
  }
}
