import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { GetUser } from './get-user.decorator';
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
  createUser(@Body() body: CreateUserDto): Promise<string> {
    return this.authService.signUp(body.email, body.password);
  }

  @Post('/signin')
  signIn(@Body() body: CreateUserDto): Promise<string> {
    return this.authService.signIn(body.email, body.password);
  }

  @UseGuards(AuthGuard())
  @Get('/:id')
  findUser(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @UseGuards(AuthGuard())
  @Get()
  findUsers(
    @Query('email') email: string,
    @GetUser() user: User,
  ): Promise<User[]> {
    console.log(user);
    return this.usersService.findByEmail(email);
  }

  @UseGuards(AuthGuard())
  @Delete('/:id')
  removeUser(@Param('id') id: string): Promise<User> {
    return this.usersService.removeUser(id);
  }

  @UseGuards(AuthGuard())
  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, body);
  }
}
