import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Passage } from 'src/passage/schemas/passage.schema';
import { Question } from 'src/question/schemas/question.schema';
import { CreateQuestionDto } from 'src/question/dto/create-question.dto';
import { CreatePassageDto } from 'src/passage/dto/create-passage.dto';
import { ToeicTestType } from 'src/enum/toeic-type.enum';
export class CreateToeicTestDto {
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
