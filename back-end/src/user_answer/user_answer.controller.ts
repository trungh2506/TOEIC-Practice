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
  HttpException,
  HttpStatus,
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

  @Post('/start/:toeic_test_id')
  async startTest(@Req() req, @Param('toeic_test_id') test_id: string) {
    const result = await this.userAnswerService.startTest(
      req.user?._id,
      test_id,
    );
    if (result.onGoingTest) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: result.message,
          onGoingTest: result.onGoingTest,
        },
        HttpStatus.CONFLICT,
      );
    }
    // Nếu không, trả về thành công
    return {
      message: 'Bài thi mới đã được bắt đầu.',
      duration: result.duration,
    };
  }

  @Post('/resume/:toeic_test_id')
  async resumeTest(@Req() req, @Param('toeic_test_id') test_id: string) {
    const result = await this.userAnswerService.resumeTest(
      req.user?._id,
      test_id,
    );
    // Nếu không, trả về thành công
    return {
      message: 'Tiếp tục làm bài thi trước đó.',
      duration: result.duration,
      questionNumberList: result.questionNumberList
    };
  }

  @Post('/submit/:toeic_test_id')
  submitTest(
    @Req() req,
    @Param('toeic_test_id') test_id: string,
    @Body() answers: any[],
  ) {
    return this.userAnswerService.submitTest(req.user?._id, test_id, answers);
  }

  @Post('/save/:toeic_test_id')
  saveTempTest(
    @Req() req,
    @Param('toeic_test_id') test_id: string,
    @Body() answers: any[],
  ) {
    return this.userAnswerService.saveTempTest(req.user?._id, test_id, answers);
  }

  @Post('/cancel/:user_answer_id')
  cancelTest(@Req() req, @Param('user_answer_id') user_answer_id: string) {
    return this.userAnswerService.cancelTest(user_answer_id);
  }
}
