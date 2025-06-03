import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ApplicationDto {
  @IsNumber()
  @IsNotEmpty()
  jobId: number;

  @IsNumber()
  @IsNotEmpty()
  accountId: number;

  @IsString()
  coverLetter: string;

  @IsArray()
  extraQuestions: Array<object>;

  @IsArray()
  keywords: Array<string>;

  @IsString()
  status: string;
}
