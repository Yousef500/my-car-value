import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string): Promise<string> {
    const existing = await this.usersService.findByEmail(email);

    if (existing.length) {
      throw new ConflictException('Email already exists...');
    } else {
      // Generate Salt
      const salt = await bcrypt.genSalt(10);

      // Generate Hash
      const hash = await bcrypt.hash(password, salt);

      // Save the user object then return it
      return this.usersService.signUp(email, hash);
    }
  }

  async signIn(email: string, password: string): Promise<string> {
    const [user] = await this.usersService.findByEmail(email);

    if (user) {
      if (
        email === user.email &&
        (await bcrypt.compare(password, user.password))
      ) {
        const payload = { email };
        const accessToken = this.jwtService.sign(payload);
        return accessToken;
      } else {
        throw new BadRequestException('Oops! Wrong email or password...');
      }
    } else {
      throw new NotFoundException('User not found...');
    }
  }
}
