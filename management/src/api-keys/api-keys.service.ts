import { Inject, Injectable, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import * as schema from '../db/schema';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { and, eq } from 'drizzle-orm';
import { DrizzlePostgres } from 'src/db/types';
import { DRIZZLE_ORM_TOKEN } from 'src/db/constants';

// Define the structure of the API key details returned to the user ONCE upon creation
export interface NewApiKeyDetails {
  id: number;
  label: string;
  prefix: string;
  key: string; // The full API key, shown only once
  createdAt: Date;
  expiresAt?: Date | null;
}

// Define the structure for API keys when listed (sensitive parts omitted)
export interface ApiKeyInfo {
  id: number;
  label: string;
  prefix: string;
  createdAt: Date;
  lastUsedAt?: Date | null;
  expiresAt?: Date | null;
  isActive: boolean;
}

@Injectable()
export class ApiKeysService {
  constructor(
    @Inject(DRIZZLE_ORM_TOKEN) private db: DrizzlePostgres,
  ) {}

  private readonly apiKeyPrefixLength = 7; // e.g., "pk_..."
  private readonly apiKeyByteLength = 32; // For crypto.randomBytes

  private generateApiKey(): { key: string; prefix: string } {
    const key = `sk_${crypto.randomBytes(this.apiKeyByteLength).toString('hex')}`.slice(0, 64); // Keep a reasonable max length for the key itself
    const prefix = key.substring(0, this.apiKeyPrefixLength);
    return { key, prefix };
  }

  private async hashApiKey(key: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(key, saltRounds);
  }

  async create(userId: number, createApiKeyDto: CreateApiKeyDto): Promise<NewApiKeyDetails> {
    const { label } = createApiKeyDto;
    const { key, prefix } = this.generateApiKey();
    const apiKeyHash = await this.hashApiKey(key);

    try {
      const [newKeyRecord] = await this.db
        .insert(schema.apiKeys)
        .values({
          userId,
          label,
          apiKeyHash,
          apiKeyPrefix: prefix,
          // expiresAt: can be added here if needed from DTO
        })
        .returning({
          id: schema.apiKeys.id,
          label: schema.apiKeys.label,
          prefix: schema.apiKeys.apiKeyPrefix,
          createdAt: schema.apiKeys.createdAt,
          expiresAt: schema.apiKeys.expiresAt,
        });

      if (!newKeyRecord) {
        throw new InternalServerErrorException('Failed to create API key.');
      }

      return {
        ...newKeyRecord,
        key, // Return the full, unhashed key to the user THIS ONE TIME
      };
    } catch (error) {
      // TODO: Add more specific error handling, e.g., for unique constraint violation on prefix (though highly unlikely)
      if (error.code === '23505') { // Unique violation for PostgreSQL
        throw new InternalServerErrorException('Failed to generate a unique API key prefix. Please try again.');
      }
      throw new InternalServerErrorException('Error creating API key: ' + error.message);
    }
  }

  async findAllForUser(userId: number): Promise<ApiKeyInfo[]> {
    return this.db
      .select({
        id: schema.apiKeys.id,
        label: schema.apiKeys.label,
        prefix: schema.apiKeys.apiKeyPrefix,
        createdAt: schema.apiKeys.createdAt,
        lastUsedAt: schema.apiKeys.lastUsedAt,
        expiresAt: schema.apiKeys.expiresAt,
        isActive: schema.apiKeys.isActive,
      })
      .from(schema.apiKeys)
      .where(eq(schema.apiKeys.userId, userId))
      .orderBy(schema.apiKeys.createdAt);
  }

  async findOneForUser(id: number, userId: number): Promise<ApiKeyInfo> {
    const [apiKey] = await this.db
      .select({
        id: schema.apiKeys.id,
        label: schema.apiKeys.label,
        prefix: schema.apiKeys.apiKeyPrefix,
        createdAt: schema.apiKeys.createdAt,
        lastUsedAt: schema.apiKeys.lastUsedAt,
        expiresAt: schema.apiKeys.expiresAt,
        isActive: schema.apiKeys.isActive,
      })
      .from(schema.apiKeys)
      .where(and(eq(schema.apiKeys.id, id), eq(schema.apiKeys.userId, userId)));

    if (!apiKey) {
      throw new NotFoundException('API key not found or does not belong to user.');
    }
    return apiKey;
  }

  async update(id: number, userId: number, updateApiKeyDto: UpdateApiKeyDto): Promise<ApiKeyInfo> {
    // First, verify the key exists and belongs to the user
    await this.findOneForUser(id, userId); // Throws NotFoundException if not found

    const [updatedKey] = await this.db
      .update(schema.apiKeys)
      .set({
        ...updateApiKeyDto, // label, isActive
        // updatedAt: new Date() // If you add an updatedAt field to your schema
      })
      .where(and(eq(schema.apiKeys.id, id), eq(schema.apiKeys.userId, userId)))
      .returning({
        id: schema.apiKeys.id,
        label: schema.apiKeys.label,
        prefix: schema.apiKeys.apiKeyPrefix,
        createdAt: schema.apiKeys.createdAt,
        lastUsedAt: schema.apiKeys.lastUsedAt,
        expiresAt: schema.apiKeys.expiresAt,
        isActive: schema.apiKeys.isActive,
      });
    
    if (!updatedKey) {
      // This should ideally not happen if findOneForUser passed and no race condition
      throw new InternalServerErrorException('Failed to update API key.');
    }
    return updatedKey;
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const [keyToDelete] = await this.db
        .select({ id: schema.apiKeys.id, userId: schema.apiKeys.userId })
        .from(schema.apiKeys)
        .where(eq(schema.apiKeys.id, id));

    if (!keyToDelete) {
        throw new NotFoundException('API key not found.');
    }

    if (keyToDelete.userId !== userId) {
        // Although the controller logic should prevent reaching here for a different user,
        // this service-level check adds another layer of security.
        throw new ForbiddenException('You do not have permission to delete this API key.');
    }
    
    const result = await this.db
      .delete(schema.apiKeys)
      .where(and(eq(schema.apiKeys.id, id), eq(schema.apiKeys.userId, userId)));

    // Drizzle delete result might vary by adapter; typically, it might return count or throw on error.
    // We check if anything was deleted. If the where clause didn't match, it might not error but also not delete.
    // However, findOneForUser (or the select above) should have caught it if it doesn't exist or belong to the user.
    // For now, we assume if no error, it was successful. A more robust check might be needed based on Drizzle PG driver behavior.
    if (result.rowCount === 0) { // For pg, rowCount indicates affected rows
        throw new NotFoundException('API key not found or could not be deleted.');
    }

    return { message: 'API key deleted successfully.' };
  }

  // --- Methods for API Key Authentication (can be used by a separate ApiKeyStrategy) ---

  async validateApiKey(key: string): Promise<{ userId: number; apiKeyId: number } | null> {
    if (!key.startsWith('sk_')) { // Basic check for our key format
        return null;
    }
    const prefix = key.substring(0, this.apiKeyPrefixLength);

    const potentialKeys = await this.db
      .select({
        id: schema.apiKeys.id,
        userId: schema.apiKeys.userId,
        apiKeyHash: schema.apiKeys.apiKeyHash,
        isActive: schema.apiKeys.isActive,
        expiresAt: schema.apiKeys.expiresAt,
      })
      .from(schema.apiKeys)
      .where(eq(schema.apiKeys.apiKeyPrefix, prefix));

    for (const potentialKey of potentialKeys) {
      if (!potentialKey.isActive) continue;
      if (potentialKey.expiresAt && new Date(potentialKey.expiresAt) < new Date()) continue;

      const isMatch = await bcrypt.compare(key, potentialKey.apiKeyHash);
      if (isMatch) {
        // Optionally update lastUsedAt
        // await this.db.update(schema.apiKeys).set({ lastUsedAt: new Date() }).where(eq(schema.apiKeys.id, potentialKey.id));
        return { userId: potentialKey.userId, apiKeyId: potentialKey.id };
      }
    }
    return null;
  }
} 