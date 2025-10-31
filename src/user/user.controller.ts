import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, type TUpdateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('update')
  update(@Body() updateUserDto: TUpdateUserDto, @Query('id') id: string) {
    return this.userService.updateById(+id, updateUserDto)
  }

}
