import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class AnswerDto {
  @IsMongoId()
  @IsNotEmpty()
  question_id: string;

  @IsString()
  @IsNotEmpty()
  selected_option: string;

  @IsString()
  @IsOptional()
  @IsIn(['correct', 'incorrect', 'unanswered']) // Chỉ chấp nhận các giá trị trong enum
  status: string;
}

export class CreateUserAnswerDto {
  @IsMongoId()
  @IsNotEmpty()
  user_id: string;

  @IsMongoId()
  @IsNotEmpty()
  toeic_test_id: string;

  @IsArray()
  @ValidateNested({ each: true }) // Kiểm tra từng phần tử trong mảng
  @Type(() => AnswerDto) // Đảm bảo các câu trả lời tuân theo AnswerDto
  answers: AnswerDto[];

  @IsOptional()
  correct_answers: number;

  @IsOptional()
  incorrect_answers: number;

  @IsOptional()
  unanswered_answers: number;

  @IsOptional()
  date_answer: Date;

  @IsOptional()
  total_score: number;

  @IsOptional()
  listening_score: number;

  @IsOptional()
  reading_score: number;

  @IsOptional()
  duration: number;
}
