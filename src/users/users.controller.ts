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
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from './interceptors/serialize.interceptor';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto): Promise<User> {
    return this.authService.signUp(body.email, body.password);
  }

  @Post('/signin')
  signIn(@Body() body: CreateUserDto): Promise<string> {
    return this.authService.signIn(body.email, body.password);
  }

  @Get('/:id')
  findUser(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Get()
  findUsers(@Query('email') email: string): Promise<User[]> {
    return this.usersService.findByEmail(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string): Promise<User> {
    return this.usersService.removeUser(id);
  }

  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, body);
  }
}
