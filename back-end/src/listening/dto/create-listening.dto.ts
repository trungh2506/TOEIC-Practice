import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { Question } from 'src/question/schemas/question.schema';

export class CreateListeningDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  original_conversation: string;

  @IsOptional()
  @IsString()
  modify_conversation?: string;

  @IsArray()
  @ArrayNotEmpty()
  blank_words: string[];

  @IsOptional()
  @IsString()
  audio?: string;

  @IsOptional()
  @IsArray()
  @Type(() => CreateQuestionDto)
  questions?: CreateQuestionDto[];
}
