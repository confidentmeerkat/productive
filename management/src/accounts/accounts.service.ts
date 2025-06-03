import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DRIZZLE_ORM_TOKEN } from 'src/db/constants';
import { accounts } from 'src/db/schema';
import { DrizzlePostgres } from 'src/db/types';
import { CreateAccountDto } from './dto/account.dto';
import { and, eq } from 'drizzle-orm';

export interface NewAccount {
  id: number;
  userId: number;
  status: string;
  type: string;
  meta: unknown;
}

@Injectable()
export class AccountsService {
  constructor(@Inject(DRIZZLE_ORM_TOKEN) private db: DrizzlePostgres) {}
  async create(
    createAccountDto: CreateAccountDto,
    userId: number,
  ): Promise<NewAccount> {
    const [newAccount] = await this.db
      .insert(accounts)
      .values({ ...createAccountDto, userId })
      .returning();

    return newAccount;
  }

  async findAll() {
    const accounts = await this.db.query.accounts.findMany({
      with: {
        user: true,
      },
    });

    return accounts;
  }

  async findOne(id: number, userId: number) {
    const account = await this.db.query.accounts.findMany({
      where: and(eq(accounts.userId, userId), eq(accounts.id, id)),
    });

    return account;
  }

  async findOneByName(name: string) {
    const account = await this.db.query.accounts.findFirst({
      where: eq(accounts.name, name),
    });

    return account;
  }

  async update(id: number, userId: number, updateAccountDto: CreateAccountDto) {
    const existingAccount = await this.db.query.accounts.findFirst({
      where: and(eq(accounts.userId, userId), eq(accounts.id, id)),
    });

    if (!existingAccount) {
      throw new InternalServerErrorException('Can not find account');
    }

    await this.db
      .update(accounts)
      .set(updateAccountDto)
      .where(eq(accounts.id, id));

    return { message: 'successfully updated' };
  }

  async remove(id: number, userId: number) {
    const account = await this.db.query.accounts.findFirst({
      where: and(eq(accounts.userId, userId), eq(accounts.id, id)),
    });

    if (!account) {
      throw new InternalServerErrorException('Can not find account');
    }

    await this.db.delete(accounts).where(eq(accounts.id, id));

    return { message: 'successfully deleted account' };
  }
}
