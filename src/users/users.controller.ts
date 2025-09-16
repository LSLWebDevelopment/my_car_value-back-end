import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthenticationService } from './authentication.service';
import { SignInUserDto } from './dtos/signIn-user.dto';

@Controller('/auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthenticationService,
  ) {}

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    return session.color;
  }

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
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signIn')
  @HttpCode(200)
  async signIn(@Body() body: SignInUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signOut')
  @HttpCode(200)
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('/whoAmI')
  whoAmI(@Session() session: any) {
    return this.usersService.findUserById(session.userId);
  }

  @Get('/:id')
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
