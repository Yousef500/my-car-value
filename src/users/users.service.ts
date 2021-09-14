import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string): Promise<string> {
    const user = await this.usersRepository.create({
      email,
      password,
    });

    this.usersRepository.save(user);

    const payload = { email };
    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found...');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User[]> {
    const users = await this.usersRepository.find({ email });
    return users;
  }

  async updateUser(id: string, attrs: Partial<User>): Promise<User> {
    const user = await this.findById(id);

    Object.assign(user, attrs);

    await this.usersRepository.save(user);

    return user;
  }

  async removeUser(id: string): Promise<User> {
    const user = await this.findById(id);

    return this.usersRepository.remove(user);
  }
}
