import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6) // Example: enforce a minimum password length
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string; // Example: include an email field

  // Add other properties as needed for user creation
} 