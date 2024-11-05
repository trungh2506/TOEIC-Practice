import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { UserAnswerService } from './user_answer.service';
import { CreateUserAnswerDto } from './dto/create-user_answer.dto';
import { UpdateUserAnswerDto } from './dto/update-user_answer.dto';
import { Public } from 'src/decorator/public.decorator';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@Controller('user-answer')
export class UserAnswerController {
  constructor(private readonly userAnswerService: UserAnswerService) {}

  @Post()
  create(@Req() req, @Body() createUserAnswerDto: CreateUserAnswerDto) {
    return this.userAnswerService.create(req.user._id, createUserAnswerDto);
  }

  @Get('user')
  findAllByUserId(@Req() req, @Query() paginationDto: PaginationDto) {
    return this.userAnswerService.findAllByUserId(req.user?._id, paginationDto);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.userAnswerService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserAnswerDto: UpdateUserAnswerDto,
  ) {
    return this.userAnswerService.update(+id, updateUserAnswerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAnswerService.remove(+id);
  }
}
