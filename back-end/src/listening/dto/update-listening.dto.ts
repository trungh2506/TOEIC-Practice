import { PartialType } from '@nestjs/swagger';
import { CreateListeningDto } from './create-listening.dto';
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';

export class UpdateListeningDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  original_conversation?: string;

  @IsOptional()
  @IsString()
  modify_conversation?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  blank_words?: string[];

  @IsOptional()
  @IsString()
  audio?: string;

  @IsOptional()
  @IsArray()
  @Type(() => CreateQuestionDto)
  questions?: CreateQuestionDto[];
}
