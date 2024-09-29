import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
export class CreateToeicTestDto {
  @IsNumber()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  image: string;
}
