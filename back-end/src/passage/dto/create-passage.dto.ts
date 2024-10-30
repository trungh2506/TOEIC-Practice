import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Question } from 'src/question/schemas/question.schema';

export class CreatePassageDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  part: number;

  @IsString()
  @IsOptional()
  images: string[];

  @IsArray()
  questions: Question[];
}
