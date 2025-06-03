import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';

enum Type {
  upwork = 'upwork',
  linkedin = 'linkedIn',
}

export class CreateAccountDto {
  @IsEnum(Type)
  @IsNotEmpty()
  type: Type;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsObject()
  @IsNotEmpty()
  meta: Record<string, any>;
}
