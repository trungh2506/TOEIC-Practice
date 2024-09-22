import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsArray,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid date of birth format' })
  dob?: Date;

  @IsOptional()
  @IsString({ message: 'Invalid phone number format' })
  number_phone?: string;

  @IsOptional()
  estimate_scores?: Record<string, any>;

  @IsOptional()
  //   @IsArray()
  //   @ValidateNested({ each: true })
  //   @Type(() => String) // Assuming saved_vocabulary are ObjectId (string)
  saved_vocabulary?: string[];

  @IsOptional()
  //   @IsArray()
  //   @ValidateNested({ each: true })
  //   @Type(() => String) // Assuming favorites are ObjectId (string)
  favorites?: string[];
}
