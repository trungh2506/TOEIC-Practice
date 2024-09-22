import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDTO {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid date of birth format' })
  dob?: Date;

  @IsOptional()
  @IsString({ message: 'Invalid phone number format' })
  number_phone?: string;
}
