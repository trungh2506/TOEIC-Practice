import { PartialType } from '@nestjs/swagger';
import { CreatePassageDto } from './create-passage.dto';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePassageDto {
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

  @IsString()
  @IsOptional()
  audio: string;

  @IsArray()
  questions: number[];
}
