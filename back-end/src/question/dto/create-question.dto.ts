import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsNumber()
  @IsNotEmpty()
  question_number: number;

  @IsString()
  @IsNotEmpty()
  question_text: string;

  @IsArray()
  @IsOptional()
  question_images?: string[];

  @IsString()
  @IsOptional()
  question_audio_url?: string;

  @IsNumber()
  @IsNotEmpty()
  part: number;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsArray()
  @IsNotEmpty()
  options: string[];

  @IsString()
  @IsNotEmpty()
  correct_answer: string;

  @IsString()
  @IsOptional()
  script?: string;
}
