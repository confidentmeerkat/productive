import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from 'pg';
import * as schema from './schema'; // Import all schemas
import { DRIZZLE_ORM_TOKEN } from './constants';

@Global() // Make the module global to avoid importing it everywhere
@Module({
  imports: [ConfigModule], // Ensure ConfigModule is available
  providers: [
    {
      provide: DRIZZLE_ORM_TOKEN,
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>('DATABASE_URL');
        if (!connectionString) {
          throw new Error('DATABASE_URL environment variable is not set');
        }
        // For Drizzle ORM with postgres-js
        const client = new Client({ connectionString });
        await client.connect();
        return drizzle(client, { schema });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DRIZZLE_ORM_TOKEN],
})
export class DrizzleModule {} 