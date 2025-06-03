import { Module } from '@nestjs/common';
import { AccountController } from './accounts.controllers';
import { AccountsService } from './accounts.service';

@Module({
  controllers: [AccountController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
