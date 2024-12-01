import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateQuestionDto {
  @IsNumber()
  @IsNotEmpty()
  question_number: number;

  @IsString()
  @IsNotEmpty()
  question_text: string;

  @IsArray()
  @IsOptional()
  question_image?: string;

  @IsString()
  @IsOptional()
  question_audio?: string;

  @IsNumber()
  @IsNotEmpty()
  part: number;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];

  @IsString()
  @IsNotEmpty()
  correct_answer: string;

  @IsOptional()
  passage_id: string;

  @IsString()
  @IsOptional()
  script?: string;
}
