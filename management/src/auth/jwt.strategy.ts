import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service'; // To validate that the user in the token still exists

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService, // Inject UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // You could add further validation here, e.g., check if user is still active or has certain roles
    // The payload will be what you signed in the AuthService login method
    const user = await this.usersService.findOneById(payload.sub); // Assuming 'sub' is the userId
    if (!user) {
      // Or handle as per your application's logic if user not found
      return null; 
    }
    // You can return the full user object or a simplified version
    // What you return here will be injected into request.user
    return { id: payload.sub, username: payload.username }; 
  }
} 