import { Module } from '@nestjs/common';
import { JwtOrApiKeyAuthGuard } from './auth.guard';

@Module({
  providers: [JwtOrApiKeyAuthGuard],
  exports: [JwtOrApiKeyAuthGuard],
})
export class GuardsModule {} 