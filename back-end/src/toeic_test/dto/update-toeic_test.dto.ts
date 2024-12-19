import { PartialType } from '@nestjs/mapped-types';
import { CreateToeicTestDto } from './create-toeic_test.dto';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Question } from 'src/question/schemas/question.schema';
import { Passage } from 'src/passage/schemas/passage.schema';
import { ToeicTestType } from 'src/enum/toeic-type.enum';

export class UpdateToeicTestDto {
  @IsNumber()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsArray()
  listening: Question[];

  @IsArray()
  reading: Question[];

  @IsString()
  @IsOptional()
  full_audio: string;

  @IsArray()
  passages: Passage[];

  @IsEnum(ToeicTestType)
  type: ToeicTestType;
}
