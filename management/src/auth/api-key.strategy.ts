import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { ApiKeysService } from '../api-keys/api-keys.service';

export interface AuthenticatedRequest extends Express.Request {
  user:
    | {
        id: number;
        apiKeyId?: number; // Optional, present only for API key auth
        authType?: 'jwt' | 'api-key'; // To distinguish auth type
      }
    | {
        id: number;
        username: string;
      };
}

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(private apiKeysService: ApiKeysService) {
    super();
  }

  async validate(request: Request): Promise<any> {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No API key provided');
    }

    // Extract the API key from the Bearer token
    const [type, apiKey] = authHeader.split(' ');
    if (type !== 'Bearer' || !apiKey) {
      throw new UnauthorizedException('Invalid API key format');
    }

    // Validate the API key and get the associated user
    const validationResult = await this.apiKeysService.validateApiKey(apiKey);
    if (!validationResult) {
      throw new UnauthorizedException('Invalid or expired API key');
    }

    // Return the user ID and API key ID to be attached to the request
    return {
      id: validationResult.userId,
      apiKeyId: validationResult.apiKeyId,
      authType: 'api-key', // This helps distinguish between JWT and API key auth
    };
  }
}
