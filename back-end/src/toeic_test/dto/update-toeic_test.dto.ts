import { PartialType } from '@nestjs/mapped-types';
import { CreateToeicTestDto } from './create-toeic_test.dto';

export class UpdateToeicTestDto extends PartialType(CreateToeicTestDto) {}
