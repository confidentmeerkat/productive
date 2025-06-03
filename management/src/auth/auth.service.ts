import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../db/schema'; // Import Drizzle User type

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.password && (await bcrypt.compare(pass, user.password))) {
      // Drizzle's select will include password, so we need to omit it here if User type includes it
      // However, our UsersService.findOneByUsername should ideally return User without password
      // For now, let's assume `user` from `findOneByUsername` is the full User from schema
      const { password, ...result } = user;
      return result as Omit<User, 'password'>; // Cast to ensure password is not part of the return type for validateUser
    }
    return null;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { username: user.username, sub: user.id }; // Use user.id from DB
    const loginUser = await this.usersService.findOneByUsername(user.username);
    return {
      loginUser: {
        id: loginUser?.id,
        username: loginUser?.username,
        email: loginUser?.email,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    // UsersService.create now expects password_hash and returns user without password
    return this.usersService.create({
      ...createUserDto,
      password_hash: hashedPassword,
    });
  }
}
