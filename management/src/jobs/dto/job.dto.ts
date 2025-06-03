import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class JobDto {
  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  skills: Array<string>;
}
