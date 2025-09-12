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
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
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

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body.email, body.password);
  }

  @Get('/:id')
  getUserById(@Param('id') id: string) {
    console.log('handler is running');
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
