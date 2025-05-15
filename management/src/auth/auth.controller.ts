import { Controller, Request, Post, UseGuards, Body, HttpStatus, HttpCode, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto'; // Assuming a DTO for user creation
import { LoginDto } from './dto/login.dto'; // Assuming a DTO for login

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK) // Explicitly set OK status for successful login
  async login(@Request() req, @Body() loginDto: LoginDto) { // Use LoginDto for validation
    // req.user is populated by LocalStrategy.validate()
    return this.authService.login(req.user);
  }

  // Optional: Registration endpoint
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) { // Use CreateUserDto for validation
    return this.authService.register(createUserDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    return req.user; // req.user is populated by JwtStrategy.validate()
  }

  /*
  // Example of a protected route:
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user; // req.user is populated by JwtStrategy.validate()
  }
  */
} 