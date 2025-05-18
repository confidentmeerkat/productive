import { IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class UpdateApiKeyDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
} 