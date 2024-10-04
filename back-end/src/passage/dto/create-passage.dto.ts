import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Question } from 'src/question/schemas/question.schema';

export class CreatePassageDto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  images: string[];

  @IsArray()
  questions: Question[];
}
