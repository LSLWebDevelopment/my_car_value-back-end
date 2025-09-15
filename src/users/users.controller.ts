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
import { AuthenticationService } from './authentication.service';

@Controller('/auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthenticationService,
  ) {}

  @Get('/all')
  getAllUsers() {
    console.log('Calling findAllUsers');
    return this.usersService.findAllUsers();
  }

  @Get('/by-email')
  async getUserByEmail(@Query('email') email: string) {
    // console.log('Calling findUserByEmail with: ', email);
    return await this.usersService.findUserByEmail(email);
  }

  @Post('/signup')
  @Serialize(UserDto)
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.authService.signUp(body.email, body.password);
    return user;
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
