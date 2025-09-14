import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('/auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/all')
  getAllUsers() {
    console.log('Calling findAllUsers');
    return this.usersService.findAllUsers();
  }

  @Get('/by-email')
  getUserByEmail(@Query('email') email: string) {
    console.log('Calling findUserByEmail with: ', email);
    return this.usersService.findUserByEmail(email);
  }

  @Post('/signup')
  @Serialize(UserDto)
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body.email, body.password);
  }

  @Get('/:id')
  @Serialize(UserDto)
  getUserById(@Param('id') id: string) {
    return this.usersService.findUserById(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(parseInt(id), body);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.removeUser(parseInt(id));
  }
}
