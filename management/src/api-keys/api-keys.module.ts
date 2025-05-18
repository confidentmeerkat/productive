import { Module } from '@nestjs/common';
import { ApiKeysController } from './api-keys.controller';
import { ApiKeysService } from './api-keys.service';
import { DrizzleModule } from '../db/drizzle.module';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    DrizzleModule,
    AuthModule,
    UsersModule,
    PassportModule,
  ],
  controllers: [ApiKeysController],
  providers: [ApiKeysService, JwtStrategy],
  exports: [ApiKeysService],
})
export class ApiKeysModule {}
