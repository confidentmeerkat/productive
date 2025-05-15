import { IsString, IsNotEmpty } from 'class-validator'; // You might need to install class-validator and class-transformer

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
} 