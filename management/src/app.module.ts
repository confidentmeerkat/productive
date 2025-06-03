import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DrizzleModule } from './db/drizzle.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { AccountsModule } from './accounts/accounts.module';
import { ApplicationsModule } from './applications/applications.module';
import { JobsModule } from './jobs/jobs.module';
import { WebhookService } from './webhook.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DrizzleModule,
    AuthModule,
    UsersModule,
    ApiKeysModule,
    AccountsModule,
    ApplicationsModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [AppService, WebhookService],
})
export class AppModule {}
