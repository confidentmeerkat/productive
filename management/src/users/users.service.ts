import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DRIZZLE_ORM_TOKEN } from '../db/constants';
import { DrizzlePostgres } from 'src/db/types'; // We'll create this type
import { users, NewUser, User } from '../db/schema/users';
import { eq } from 'drizzle-orm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE_ORM_TOKEN) private db: DrizzlePostgres) {}

  async findOneByUsername(username: string): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return result[0];
  }

  async findOneById(userId: number): Promise<User | undefined> {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    return result[0];
  }

  async create(
    createUserDto: CreateUserDto & { password_hash: string },
  ): Promise<Omit<User, 'password'>> {
    const { username, email, password_hash } = createUserDto;

    // Check if username or email already exists
    const existingUser = await this.db.query.users.findFirst({
      where: (table, { or }) =>
        or(eq(table.username, username), eq(table.email, email)),
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      }
    }

    const newUser: NewUser = {
      username,
      email,
      password: password_hash, // Ensure password field in schema matches
    };

    const insertedUsers = await this.db
      .insert(users)
      .values(newUser)
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (!insertedUsers || insertedUsers.length === 0) {
      throw new Error('User creation failed'); // Or a more specific error
    }
    return insertedUsers[0];
  }

  // Add other user-related methods as needed (e.g., update, delete)
}
